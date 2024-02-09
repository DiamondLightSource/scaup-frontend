import { ChildSelector } from "@/components/containers/childSelector";
import { TreeData } from "@/components/visualisation/treeView";
import { selectActiveItem } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { calcCircumferencePos } from "@/utils/generic";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BaseContainerProps, useChildLocationManager } from ".";
import { GenericChildSlot } from "./child";

export const Puck = ({ shipmentId, formContext }: BaseContainerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentGridBox = useSelector(selectActiveItem);
  const [currentItem, setCurrentItem] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const items = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newItems = Array(16).fill(null);
    if (currentGridBox!.children) {
      for (const innerSample of currentGridBox!.children) {
        newItems[innerSample.data.location - 1] = innerSample;
      }
    }
    return newItems;
  }, [currentGridBox]);

  const setLocation = useChildLocationManager({
    shipmentId,
    containerCreationPreset: { capacity: 16, type: "puck" },
  });

  const handlePopulatePosition = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(currentGridBox!.id, sample, currentPosition);
    },
    [currentGridBox, currentPosition, setLocation],
  );

  const handleRemoveSample = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(null, sample, null);
    },
    [setLocation],
  );

  const handleGridClicked = useCallback(
    (sample: TreeData<PositionedItem> | null, i: number) => {
      setCurrentItem(sample);
      setCurrentPosition(i);
      onOpen();
    },
    [onOpen],
  );

  return (
    <Box
      w='296px'
      h='296px'
      m='20px'
      position='relative'
      border='3px solid'
      borderRadius='100%'
      borderColor='diamond.700'
      bg='#D0E0FF'
    >
      {items.slice(0, 5).map((item, i) => (
        <GenericChildSlot
          key={i}
          label={i + 1}
          hasSample={item !== null}
          onClick={() => handleGridClicked(item, i)}
          right={`${50 + calcCircumferencePos(i, 5, 55, false)}px`}
          top={`${50 + calcCircumferencePos(i, 5, 55)}px`}
        />
      ))}
      {items.slice(5).map((item, i) => (
        <GenericChildSlot
          key={i}
          onClick={() => handleGridClicked(item, i + 5)}
          label={i + 6}
          hasSample={item !== null}
          right={`${calcCircumferencePos(i, 11, 105, false)}px`}
          top={`${calcCircumferencePos(i, 11, 105)}px`}
        />
      ))}
      <ChildSelector
        childrenType='gridBox'
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={currentItem}
        isOpen={isOpen}
        onClose={onClose}
        readOnly={formContext === undefined}
      />
    </Box>
  );
};
