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
import { useFormContext } from "react-hook-form";
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

export const Puck = ({ shipmentId }: GridBoxProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const currentGridBox = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const { control } = useFormContext();

  const samples = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newSamples = Array(16).fill(null);
    if (currentGridBox.children) {
      for (const innerSample of currentGridBox.children) {
        newSamples[innerSample.data.location] = innerSample;
      }
    }
    return newSamples;
  }, [currentGridBox]);

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
          { capacity: 16, type: "puck" },
          "containers",
        );
        actualContainerId = newContainer.id;
      }

      await Item.patch(
        session,
        shipmentId,
        sample.id,
        { location, parentId: actualContainerId },
        "containers",
      ).then(async () => {
        await Promise.all([
          dispatch(updateShipment({ session, shipmentId })),
          dispatch(updateUnassigned({ session, shipmentId })),
        ]);
        dispatch(syncActiveItem({ id: actualContainerId ?? undefined, type: "puck" }));
      });
    },
    [dispatch, session, shipmentId, isEdit],
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
      {samples.slice(0, 5).map((sample, i) => (
        <GenericChildSlot
          key={i}
          label={i + 1}
          hasSample={sample !== null}
          onClick={() => handleGridClicked(sample, i)}
          right={`${50 + calcCircumferencePos(i, 5, 55, false)}px`}
          top={`${50 + calcCircumferencePos(i, 5, 55)}px`}
        />
      ))}
      {samples.slice(5).map((sample, i) => (
        <GenericChildSlot
          key={i}
          onClick={() => handleGridClicked(sample, i + 5)}
          label={i + 6}
          hasSample={sample !== null}
          right={`${calcCircumferencePos(i, 11, 105, false)}px`}
          top={`${calcCircumferencePos(i, 11, 105)}px`}
        />
      ))}
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
