import { ChildSelector } from "@/components/containers/childSelector";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Item } from "@/utils/client/item";
import {
  Box,
  Button,
  HStack,
  Heading,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface GridBoxProps {
  /** Shipment ID */
  shipmentId: string;
}

export interface GridItemProps {
  /** Whether or not this grid position has a sample in it */
  hasSample: boolean;
  /** Position of the grid in the parent grid box */
  position: number;
  /** Callback for clicking on a given position */
  onSampleClick: () => void;
}

/**
 * Grid box component. Should be used in conjunction with a field allowing the user to select
 * how many slots (capacity) the grid box should have, inside the parent form.
 */
export const GenericContainer = ({ shipmentId }: GridBoxProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const currentContainer = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const { control } = useFormContext();

  const capacity = useWatch({ control, name: "capacity", defaultValue: 4 });
  const parsedCapacity = useMemo(() => (capacity ? parseInt(capacity) : 4), [capacity]);

  const setLocation = useCallback(
    async (
      containerId: string | number | null,
      location: number | null,
      sample: TreeData<BaseShipmentItem>,
    ) => {
      let actualContainerId = containerId;

      // If container does not exist yet in database, we must create it
      if (!isEdit) {
        await Item.create(session, shipmentId, { type: currentContainer.data.type }, "containers");
      }

      Item.patch(
        session,
        shipmentId,
        sample.id,
        { location, containerId: actualContainerId },
        "containers",
      ).then(async () => {
        await Promise.all([
          dispatch(updateShipment({ session, shipmentId })),
          dispatch(updateUnassigned({ session, shipmentId })),
        ]);
        dispatch(syncActiveItem((actualContainerId as number) || undefined));
      });
    },
    [isEdit, session, shipmentId, currentContainer.data.type, dispatch],
  );

  const handlePopulatePosition = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(currentContainer.id, null, sample);
    },
    [currentContainer, currentPosition, setLocation],
  );

  const handleRemoveSample = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(null, null, sample);
    },
    [setLocation],
  );

  const handleRowClicked = useCallback(
    (sample: TreeData<PositionedItem> | null, i: number) => {
      setCurrentSample(sample);
      setCurrentPosition(i);
      onOpen();
    },
    [onOpen],
  );

  return (
    <Box w='200px' h='70%' p='10px' border='3px solid' borderColor='gray.800'>
      <HStack w='100%' borderBottom='1px solid' borderColor='gray.800' mb='5px' pb='3px'>
        <Heading fontSize='24px' flex='1 0 0'>
          Contents
        </Heading>
        <Button size='sm' onClick={onOpen}>
          Add
        </Button>
      </HStack>
      <List overflowY='scroll' h='80%'>
        {(currentContainer.children ?? []).map((item) => (
          <ListItem
            key={item.id}
            borderBottom='1px solid'
            borderColor='gray.300'
            py='5px'
            display='flex'
          >
            <Text flex='1 0 0'>{item.name}</Text>
            <Button size='xs'>Remove</Button>
          </ListItem>
        ))}
      </List>
      <ChildSelector
        childrenType='gridBox'
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={currentSample}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};
