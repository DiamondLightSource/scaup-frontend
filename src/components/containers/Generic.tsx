import { BaseContainerProps, useChildLocationManager } from "@/components/containers";
import { ChildSelector } from "@/components/containers/ChildSelector";
import { TreeData } from "@/components/visualisation/treeView";
import { selectActiveItem } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, Step } from "@/mappings/pages";
import { Box, Button, Heading, List, ListItem, Text, useDisclosure } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export interface GenericContainerProps extends BaseContainerProps {
  parent?: Step["endpoint"];
  child?: Step["endpoint"];
}

export const GenericContainer = ({
  parentId,
  formContext,
  parentType = "shipment",
  parent = "containers",
  child = "containers",
}: GenericContainerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentContainer = useSelector(selectActiveItem);
  const setLocation = useChildLocationManager({ parentId, parent, child, parentType });

  const handlePopulatePosition = useCallback(
    async (samples: TreeData<BaseShipmentItem>[]) => {
      await setLocation(currentContainer!.id, samples);
    },
    [currentContainer, setLocation],
  );

  const handleRemoveSample = useCallback(
    async (sample: TreeData<BaseShipmentItem>) => {
      await setLocation(null, sample);
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
        {(currentContainer!.children ?? []).map((item) => {
          const isStored = childSpecificType === "gridBox" && item.data.store;
          return (
            <ListItem
              key={item.id}
              p='5px'
              display='flex'
              bg={isStored ? "#46BDB2" : "diamond.50"}
              mb='3px'
              borderRadius='4px'
              title={isStored ? "Stored at eBIC" : undefined}
              aria-label={item.name}
            >
              <Text flex='1 0 0'>{item.name}</Text>
              {formContext !== undefined && (
                <Button bg='red.600' size='xs' onClick={() => handleRemoveSample(item)}>
                  Remove
                </Button>
              )}
            </ListItem>
          );
        })}
        <ListItem mt='5px'>
          {formContext !== undefined && (
            <Button w='100%' size='sm' onClick={onOpen}>
              Add
            </Button>
          )}
        </ListItem>
      </List>
      <ChildSelector
        childrenType={childSpecificType}
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={null}
        isOpen={isOpen}
        onClose={onClose}
        readOnly={formContext === undefined}
        acceptMultiple={true}
      />
    </Box>
  );
};
