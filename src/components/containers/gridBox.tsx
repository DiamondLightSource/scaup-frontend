import {
  moveToUnassigned,
  removeUnassigned,
  saveActiveItem,
  selectActiveItem,
  setActiveItem,
} from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { Box, Button, Grid, useDisclosure } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChildSelector } from "../childSelector";
import { TreeData } from "../treeView";

export interface GridBoxProps {
  /** Number of positions available in grid box */
  positions: number;
}

export interface GridItemProps {
  /** Whether or not this grid position has a sample in it */
  hasSample: boolean;
  /** Position of the grid in the parent grid box */
  position: number;
  /** Callback for clicking on a given position */
  onSampleClick: () => void;
}

const GridItem = ({ hasSample, position, onSampleClick }: GridItemProps) => {
  return (
    <Button
      onClick={onSampleClick}
      variant={hasSample ? "default" : "outline"}
      border='3px solid'
      borderColor='diamond.700'
    >
      {position + 1}
    </Button>
  );
};

export const GridBox = ({ positions }: GridBoxProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const currentGridBox = useSelector(selectActiveItem);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const samples = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newSamples = Array(positions).fill(null);
    if (currentGridBox.children) {
      for (const innerSample of currentGridBox.children) {
        newSamples[innerSample.data.position] = innerSample;
      }
    }
    return newSamples;
  }, [currentGridBox, positions]);

  const handlePopulatePosition = useCallback(
    (sample: TreeData<PositionedItem>) => {
      const newGridBox = structuredClone(currentGridBox);
      const newSample = { ...sample, data: { ...sample.data, position: currentPosition } };

      if (Array.isArray(newGridBox.children)) {
        newGridBox.children.push(newSample);
      } else {
        newGridBox.children = [newSample];
      }

      dispatch(setActiveItem({ item: newGridBox }));
      dispatch(saveActiveItem(newGridBox));
      dispatch(removeUnassigned(sample));
    },
    [dispatch, currentPosition, currentGridBox],
  );

  const handleGridClicked = useCallback(
    (sample: TreeData<PositionedItem> | null, i: number) => {
      setCurrentSample(sample);
      setCurrentPosition(i);
      onOpen();
    },
    [onOpen],
  );

  const handleRemoveSample = useCallback(
    (sample: TreeData<PositionedItem>) => {
      dispatch(moveToUnassigned(sample));
    },
    [dispatch],
  );

  if (currentGridBox.data.type !== "gridBox") {
    return null;
  }

  // TODO: actually make this resemble a grid box
  return (
    <Box w='250px' h='250px' p='40px'>
      <Grid gap='2' templateColumns={`repeat(${Math.floor(positions / 2)}, 1fr)`}>
        {samples.map((sample, i) => (
          <GridItem
            key={i}
            hasSample={sample !== null}
            position={i}
            onSampleClick={() => handleGridClicked(sample, i)}
          />
        ))}
      </Grid>
      <ChildSelector
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={currentSample}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};
