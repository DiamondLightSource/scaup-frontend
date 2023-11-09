import { BaseContainerProps, useChildLocationManager } from "@/components/containers";
import { ChildSelector } from "@/components/containers/childSelector";
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
  shipmentId,
  formContext,
  parent = "containers",
  child = "containers",
}: GenericContainerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentContainer = useSelector(selectActiveItem);
  const setLocation = useChildLocationManager({ shipmentId, parent, child });

  const handlePopulatePosition = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(currentContainer.id, sample);
    },
    [currentContainer, setLocation],
  );

  const handleRemoveSample = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(null, sample);
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
            {formContext !== undefined && (
              <Button bg='red.600' size='xs' onClick={() => handleRemoveSample(item)}>
                Remove
              </Button>
            )}
          </ListItem>
        ))}
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
      />
    </Box>
  );
};
