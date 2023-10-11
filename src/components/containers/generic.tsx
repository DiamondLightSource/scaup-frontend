import { ChildSelector } from "@/components/containers/childSelector";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, Step, separateDetails } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Item } from "@/utils/client/item";
import { Box, Button, Heading, List, ListItem, Text, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { BaseContainerProps } from ".";

export interface GenericContainerProps extends BaseContainerProps {
  parent?: Step["endpoint"];
  child?: Step["endpoint"];
}

export const GenericContainer = ({
  shipmentId,
  parent = "containers",
  child = "containers",
}: GenericContainerProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const currentContainer = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
  const { getValues } = useFormContext();

  const setLocation = useCallback(
    async (
      containerId: string | number | null,
      location: number | null,
      sample: TreeData<BaseShipmentItem>,
    ) => {
      let actualContainerId = containerId;
      const values = separateDetails(getValues(), parent);

      // If container does not exist yet in database, we must create it
      if (!isEdit) {
        const newItem = await Item.create(session, shipmentId, values, parent);

        // TODO: type return of above properly
        actualContainerId = newItem.id as number;
      }

      await Item.patch(
        session,
        shipmentId,
        sample.id,
        {
          location,
          [parent === "topLevelContainers" ? "topLevelContainerId" : "parentId"]: actualContainerId,
        },
        child,
      );

      await Promise.all([
        dispatch(updateShipment({ session, shipmentId })),
        dispatch(updateUnassigned({ session, shipmentId })),
      ]);

      dispatch(syncActiveItem({ id: actualContainerId ?? undefined, type: values.type }));
    },
    [isEdit, session, shipmentId, dispatch, getValues, parent, child],
  );

  const handlePopulatePosition = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(currentContainer.id, null, sample);
    },
    [currentContainer, setLocation],
  );

  const handleRemoveSample = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(null, null, sample);
    },
    [setLocation],
  );

  const childSpecificType = useMemo((): BaseShipmentItem["type"] => {
    switch (parent) {
      case "topLevelContainers":
        return "genericContainer";
      default:
        return "gridBox";
    }
  }, [parent]);

  return (
    <Box
      w='296px'
      h='70%'
      p='10px'
      m='20px'
      border='3px solid'
      borderColor='diamond.700'
      bg='#D0E0FF'
    >
      <Heading
        fontSize='24px'
        w='100%'
        borderBottom='1px solid'
        borderColor='gray.800'
        mb='5px'
        pb='3px'
      >
        Contents
      </Heading>
      <List overflowY='scroll' h='80%'>
        {(currentContainer.children ?? []).map((item) => (
          <ListItem
            key={item.id}
            p='5px'
            display='flex'
            bg='diamond.50'
            mb='3px'
            borderRadius='4px'
          >
            <Text flex='1 0 0'>{item.name}</Text>
            <Button bg='red.600' size='xs' onClick={() => handleRemoveSample(item)}>
              Remove
            </Button>
          </ListItem>
        ))}
        <ListItem mt='5px'>
          <Button w='100%' size='sm' onClick={onOpen}>
            Add
          </Button>
        </ListItem>
      </List>
      <ChildSelector
        childrenType={childSpecificType}
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={null}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};
