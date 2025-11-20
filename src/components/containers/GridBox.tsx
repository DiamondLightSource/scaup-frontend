import { ChildSelector } from "@/components/containers/ChildSelector";
import { TreeData } from "@/components/visualisation/treeView";
import { selectActiveItem, selectUnassigned } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { calcCircumferencePos } from "@/utils/generic";
import { Box, useDisclosure, Alert, AlertDescription, AlertIcon, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ContainerProps, useChildLocationManager } from ".";
import { GenericChildSlot } from "@/components/containers/child";
import { CrossShipmentSelector } from "@/components/containers/CrossShipmentSelector";
import Image from "next/image";
import { ContainerItem, ItemDetails } from "@/types/generic";

const GRID_BOX_TYPES: Record<string, ContainerItem[]> = {
  "1": [
    { x: 55, y: 55 },
    { x: 201, y: 55 },
    { x: 201, y: 201 },
    { x: 55, y: 201 },
  ],
  "2": [
    { x: 55, y: 55 },
    { x: 103, y: 45 },
    { x: 151, y: 45 },
    { x: 201, y: 55 },
    { x: 201, y: 201 },
    { x: 151, y: 211 },
    { x: 103, y: 211 },
    { x: 55, y: 201 },
  ],
  "3": [
    { x: 55, y: 65 },
    { x: 131, y: 35 },
    { x: 201, y: 75 },
    { x: 201, y: 181 },
    { x: 131, y: 221 },
    { x: 55, y: 191 },
  ],
  "4": Array.from({ length: 12 }, (_, i) => ({
    x: calcCircumferencePos(12 - i, 13, 105),
    y: calcCircumferencePos(12 - i, 13, 105, false),
  })),
  auto: [
    { x: 55, y: 201 },
    { x: 55, y: 55 },
    { x: 201, y: 201 },
    { x: 201, y: 55 },
  ],
};

/**
 * Grid box component. Should be used in conjunction with a field allowing the user to select
 * how many slots (capacity) the grid box should have, inside the parent form.
 */
export const GridBox = ({
  parentId,
  parentType = "shipment",
  formContext,
  containerSubType,
}: Omit<ContainerProps, "containerType">) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const unassigned = useSelector(selectUnassigned);
  const currentGridBox = useSelector(selectActiveItem);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const positions = useMemo(() => {
    const selectedType = GRID_BOX_TYPES[containerSubType ?? "1"] || GRID_BOX_TYPES["1"];
    const newSamples: Required<ContainerItem>[] = selectedType.map((v) => ({
      ...v,
      item: null,
    }));
    let sampleOverload = false;

    if (currentGridBox?.data.type === "gridBox" && currentGridBox!.children) {
      for (const innerSample of currentGridBox!.children) {
        if (!newSamples[innerSample.data.location - 1]) {
          sampleOverload = true;
          continue;
        }
        // Sample indexes start at 1; historical reasons
        newSamples[innerSample.data.location - 1].item = innerSample;
      }
    }
    return { samples: newSamples, sampleOverload };
  }, [currentGridBox, containerSubType]);

  const selectableSamples = useMemo(
    () =>
      unassigned[0].children![getCurrentStepIndex("Grid")].children?.map((grid) => ({
        ...grid,
        data: {
          ...grid.data,
          displayDetails: [
            { label: "Concentration", value: grid.data.concentration, measurementUnit: "mg/ml" },
            { label: "Buffer", value: grid.data.buffer },
            { label: "Support Material", value: grid.data.supportMaterial },
            { label: "Foil", value: grid.data.foil },
            { label: "Mesh", value: grid.data.mesh },
            { label: "Hole Diameter", value: grid.data.hole },
          ] as ItemDetails[],
        },
      })),
    [unassigned],
  );

  const setLocation = useChildLocationManager({
    parentId,
    parent: "containers",
    child: "samples",
    parentType,
    containerCreationPreset: { type: "gridBox" },
  });

  const handlePopulatePosition = useCallback(
    async (sample: TreeData<BaseShipmentItem>) => {
      await setLocation(currentGridBox!.id, sample, currentPosition);
    },
    [currentGridBox, currentPosition, setLocation],
  );

  const handleRemoveSample = useCallback(
    async (sample: TreeData<BaseShipmentItem>) => {
      await setLocation(null, sample, null);
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
    <VStack w='296px'>
      {positions.sampleOverload && (
        <Alert status='error'>
          <AlertIcon />
          <AlertDescription>
            At least one sample was previously assigned a position that does not exist in this grid
            box. Please <b>remove samples</b> before switching grid box types.
          </AlertDescription>
        </Alert>
      )}
      <Box w='296px' h='296px' position='relative' margin='20px'>
        <Image width={296} height={296} alt='Gridbox' src='/containers/gridbox.svg' />
        {positions.samples.map((sample, i) => (
          <GenericChildSlot
            key={i}
            label={i + 1}
            hasSample={sample.item !== null}
            onClick={() => handleGridClicked(sample.item, i)}
            left={`${sample.x}px`}
            top={`${sample.y}px`}
            borderRadius='0'
          />
        ))}
        {parentType === "shipment" ? (
          <ChildSelector
            displayDetails={true}
            selectableChildren={selectableSamples}
            childrenType='sample'
            onSelect={handlePopulatePosition}
            onRemove={handleRemoveSample}
            selectedItem={currentSample}
            isOpen={isOpen}
            onClose={onClose}
            readOnly={formContext === undefined}
          />
        ) : (
          <CrossShipmentSelector
            selectedItem={currentSample}
            isOpen={isOpen}
            onClose={onClose}
            onSelect={handlePopulatePosition}
            onRemove={handleRemoveSample}
            childrenType='sample'
          />
        )}
      </Box>
    </VStack>
  );
};
