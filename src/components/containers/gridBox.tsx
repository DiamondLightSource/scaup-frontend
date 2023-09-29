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
import { calcCircumferencePos } from "@/utils/generic";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { GenericChildSlot } from "./child";

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
export const GridBox = ({ shipmentId }: GridBoxProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const currentGridBox = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
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
      if (containerId !== null && !isEdit) {
        const newContainer = await Item.create(
          session,
          shipmentId,
          { capacity, type: "gridBox" },
          "containers",
        );
        actualContainerId = newContainer.id;
      }

      await Item.patch(
        session,
        shipmentId,
        sample.id,
        { location, containerId: actualContainerId },
        "samples",
      ).then(async () => {
        await Promise.all([
          dispatch(updateShipment({ session, shipmentId })),
          dispatch(updateUnassigned({ session, shipmentId })),
        ]);
        dispatch(syncActiveItem({ id: actualContainerId ?? undefined }));
      });
    },
    [dispatch, session, shipmentId, capacity, isEdit],
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
      />
    </Box>
  );
};
