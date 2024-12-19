import { useChildLocationManager } from "@/components/containers";
import { ChildSelector } from "@/components/containers/ChildSelector";
import { TreeData } from "@/components/visualisation/treeView";
import { selectActiveItem } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { Button, Heading, List, Spacer, Tag, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { PositionedItem } from "@/mappings/forms/sample";
import { ChildSelectorProps } from "@/types/generic";
import { GenericContainerProps } from "./Generic";

export interface GenericContainerWithPositionProps extends GenericContainerProps {
  capacity: number;
  selectableChildren?: ChildSelectorProps["selectableChildren"];
  /** Narrower type used when automatically creating new item, e.g.: puck*/
  presetType?: string;
}

export const GenericContainerWithPosition = ({
  parentId,
  formContext,
  parentType,
  capacity,
  selectableChildren,
  parent,
  child,
  presetType = "genericContainer",
}: GenericContainerWithPositionProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentContainer = useSelector(selectActiveItem);
  const [currentItem, setCurrentItem] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const setLocation = useChildLocationManager({
    parentId,
    parentType,
    parent,
    child,
    containerCreationPreset: { capacity, type: presetType },
  });

  const items = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newItems = Array(capacity).fill(null);
    if (currentContainer!.children) {
      for (const innerPuck of currentContainer!.children) {
        newItems[innerPuck.data.location - 1] = innerPuck;
      }
    }
    return newItems;
  }, [currentContainer, capacity]);

  const handlePopulatePosition = useCallback(
    async (sample: TreeData<BaseShipmentItem>) => {
      await setLocation(currentContainer!.id, sample, currentPosition);
    },
    [currentContainer, setLocation, currentPosition],
  );

  const handleRemoveSample = useCallback(
    async (sample: TreeData<BaseShipmentItem>) => {
      await setLocation(null, sample);
    },
    [setLocation],
  );

  const handlePositionClicked = useCallback(
    (sample: TreeData<PositionedItem> | null, i: number) => {
      setCurrentItem(sample);
      setCurrentPosition(i);
      onOpen();
    },
    [onOpen],
  );

  return (
    <VStack
      w='296px'
      h='22em'
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
      <List overflowY='scroll' w='100%'>
        {items.map((item, i) => (
          <Button
            key={i}
            p='5px'
            display='flex'
            bg={item === null ? "diamond.75" : "diamond.700"}
            mb='3px'
            borderRadius='4px'
            onClick={() => handlePositionClicked(item, i)}
            border='2px solid'
            borderColor='diamond.700'
            w='100%'
          >
            <Tag colorScheme='teal'>{i + 1}</Tag>
            <Text ml='0.5em' fontWeight='600' color={item === null ? "diamond.800" : "diamond.50"}>
              {item?.name ?? ""}
            </Text>
            <Spacer />
          </Button>
        ))}
      </List>
      <ChildSelector
        childrenType='puck'
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={currentItem}
        isOpen={isOpen}
        onClose={onClose}
        readOnly={formContext === undefined}
        selectableChildren={selectableChildren}
      />
    </VStack>
  );
};
