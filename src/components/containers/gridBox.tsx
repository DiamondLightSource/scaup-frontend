import { ChildSelector } from "@/components/containers/childSelector";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { authenticatedFetch } from "@/utils/client";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface GridBoxProps {
  /** Number of positions available in grid box */
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
export const GridBox = ({ shipmentId }: GridBoxProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const currentGridBox = useSelector(selectActiveItem);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const { control } = useFormContext();

  const capacity = useWatch({ control, name: "capacity", defaultValue: 4 });
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

  const setLocation = useCallback(
    async (
      containerId: string | number | null,
      location: number | null,
      sample: TreeData<BaseShipmentItem>,
    ) => {
      let actualContainerId = containerId;

      // If container does not exist yet in database, we must create it
      if (containerId !== null && containerId === "new-gridBox") {
        const requestBody = { capacity, type: "gridBox" };
        const response = await authenticatedFetch.client(
          `/shipments/${shipmentId}/containers`,
          session,
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          },
        );

        if (response && response.status === 201) {
          // TODO: properly type response
          const newContainer = await response.json();
          actualContainerId = newContainer.id;
        }
      }

      const requestBody = { location, containerId: actualContainerId };
      const response = await authenticatedFetch.client(
        `/shipments/${shipmentId}/samples/${sample.id}`,
        session,
        {
          method: "PATCH",
          body: JSON.stringify(requestBody),
        },
      );

      if (response && response.status === 200) {
        await Promise.all([
          dispatch(updateShipment({ session, shipmentId })),
          dispatch(updateUnassigned({ session, shipmentId })),
        ]);
        dispatch(syncActiveItem((actualContainerId as number) || undefined));
      }
    },
    [dispatch, session, shipmentId, capacity],
  );

  const handlePopulatePosition = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(currentGridBox.id, currentPosition, sample);
    },
    [currentGridBox, currentPosition, setLocation],
  );

  const handleRemoveSample = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      setLocation(null, null, sample);
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

  if (currentGridBox.data.type !== "gridBox") {
    return null;
  }

  return (
    <Box
      w='296px'
      h='296px'
      position='relative'
      border='3px solid'
      borderRadius='100%'
      borderColor='diamond.700'
      bg='#D0E0FF'
    >
      {samples.map((sample, i) => (
        <Button
          key={i}
          data-testid={`${i}-${sample !== null ? "populated" : "empty"}`}
          position='absolute'
          onClick={() => handleGridClicked(sample, i)}
          variant={sample !== null ? "default" : "outline"}
          bgColor={sample !== null ? "diamond.700" : "diamond.75"}
          border='3px solid'
          borderColor='diamond.700'
          h='40px'
          w='40px'
          /* Calculate angular spacing between items, multiply by item index to obtain position
           * in circumference of circle, use sine/cosine to get cartesian coordinates.
           * Multiply by radius of inner circle, then apply offset to centre (radius +
           * half of button's width (20px) + margin (5px)) of outer circle */
          left={`${Math.cos(((2 * Math.PI) / samples.length) * i) * 105 + 125}px`}
          top={`${Math.sin(((2 * Math.PI) / samples.length) * i) * 105 + 125}px`}
        >
          {i + 1}
        </Button>
      ))}
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
