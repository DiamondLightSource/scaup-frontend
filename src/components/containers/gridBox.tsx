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
export const GridBox = ({ shipmentId, formContext }: BaseContainerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentGridBox = useSelector(selectActiveItem);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const capacity =
    formContext !== undefined ? formContext.watch("capacity", 4) : currentGridBox.data.capacity;
  const parsedCapacity = useMemo(() => (capacity ? parseInt(capacity) : 4), [capacity]);

  const samples = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newSamples = Array(parsedCapacity).fill(null);
    if (currentGridBox.children) {
      for (const innerSample of currentGridBox.children) {
        newSamples[innerSample.data.location] = innerSample;
      }
    }
    return newSamples;
  }, [currentGridBox, parsedCapacity]);

  const setLocation = useChildLocationManager({
    shipmentId,
    parent: "containers",
    child: "samples",
  });

  const handlePopulatePosition = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(currentGridBox.id, sample, currentPosition);
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
      setCurrentSample(sample);
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
      {samples.map((sample, i) => (
        <GenericChildSlot
          key={i}
          label={i + 1}
          hasSample={sample !== null}
          onClick={() => handleGridClicked(sample, i)}
          left={`${calcCircumferencePos(i, samples.length, 105, false)}px`}
          top={`${calcCircumferencePos(i, samples.length, 105)}px`}
          borderRadius='0'
        />
      ))}
      <ChildSelector
        childrenType='sample'
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={currentSample}
        isOpen={isOpen}
        onClose={onClose}
        readOnly={formContext === undefined}
      />
    </Box>
  );
};
