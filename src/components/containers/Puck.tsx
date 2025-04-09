import { ChildSelector } from "@/components/containers/ChildSelector";
import { TreeData } from "@/components/visualisation/treeView";
import { selectActiveItem } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { Alert, AlertDescription, AlertIcon, Box, useDisclosure, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ContainerProps, useChildLocationManager } from ".";
import Image from "next/image";
import { GenericChildSlot, GenericChildSlotProps } from "@/components/containers/child";
import { CrossShipmentSelector } from "@/components/containers/CrossShipmentSelector";
import { ContainerItem } from "@/types/generic";

const PUCK_IMAGES: Record<string, string> = {
  "1": "/containers/puck1.svg",
  "2": "/containers/puck2.svg",
};
const PUCK_TYPES: Record<string, ContainerItem[]> = {
  "1": [
    { x: 88, y: 20 },
    { x: 168, y: 20 },
    { x: 58, y: 80 },
    { x: 128, y: 80 },
    { x: 198, y: 80 },
    { x: 18, y: 140 },
    { x: 88, y: 140 },
    { x: 158, y: 140 },
    { x: 228, y: 140 },
    { x: 58, y: 200 },
    { x: 128, y: 200 },
    { x: 198, y: 200 },
  ],
  "2": [
    { x: 168, y: 30 },
    { x: 228, y: 90 },
    { x: 228, y: 167 },
    { x: 168, y: 226 },
    { x: 88, y: 226 },
    { x: 28, y: 167 },
    { x: 28, y: 90 },
    { x: 88, y: 30 },
    { x: 163, y: 90 },
    { x: 163, y: 167 },
    { x: 93, y: 167 },
    { x: 93, y: 90 },
  ],
};

export const Puck = ({
  parentId,
  parentType = "shipment",
  formContext,
  containerSubType,
}: Omit<ContainerProps, "containerType">) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPuck = useSelector(selectActiveItem);
  const [currentItem, setCurrentItem] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const positions = useMemo(() => {
    const selectedType = PUCK_TYPES[containerSubType ?? "1"] || PUCK_TYPES["1"];
    const newItems: Required<ContainerItem>[] = selectedType.map((v) => ({
      ...v,
      item: null,
    }));
    let itemOverload = false;

    if (currentPuck!.children) {
      for (const innerItem of currentPuck!.children) {
        if (!newItems[innerItem.data.location - 1]) {
          itemOverload = true;
          continue;
        }

        newItems[innerItem.data.location - 1].item = innerItem;
      }
    }
    return { items: newItems, itemOverload };
  }, [currentPuck, containerSubType]);

  const imageLocation = useMemo(
    () => PUCK_IMAGES[containerSubType ?? "1"] || PUCK_IMAGES["1"],
    [containerSubType],
  );

  const setLocation = useChildLocationManager({
    parentId,
    parentType,
  });

  const handlePopulatePosition = useCallback(
    async (item: TreeData<BaseShipmentItem>) => {
      await setLocation(currentPuck!.id, item, currentPosition);
    },
    [currentPuck, currentPosition, setLocation],
  );

  const handleRemoveItem = useCallback(
    async (item: TreeData<BaseShipmentItem>) => {
      await setLocation(null, item, null);
    },
    [setLocation],
  );

  const handleGridClicked = useCallback(
    (item: TreeData<PositionedItem> | null, i: number) => {
      setCurrentItem(item);
      setCurrentPosition(i);
      onOpen();
    },
    [onOpen],
  );

  return (
    <VStack w='296px'>
      {positions.itemOverload && (
        <Alert status='error'>
          <AlertIcon />
          <AlertDescription>
            At least one item was previously assigned a position that does not exist in this puck.
            Please <b>remove children</b> before switching puck types.
          </AlertDescription>
        </Alert>
      )}
      <Box w='296px' h='296px' position='relative' margin='20px'>
        <Image width={296} height={296} alt='Puck' src={imageLocation} />
        {positions.items.map((item, i) => {
          const props: GenericChildSlotProps = {
            label: i + 1,
            hasSample: item.item !== null,
            onClick: () => handleGridClicked(item.item, i),
            left: `${item.x}px`,
            top: `${item.y}px`,
          };

          if (item.item && item.item.data.store === true) {
            props.bgColor = "#46BDB2";
            props.title = "Stored at eBIC";
          }

          return <GenericChildSlot key={i} {...props} />;
        })}
        {parentType === "shipment" ? (
          <ChildSelector
            childrenType='gridBox'
            onSelect={handlePopulatePosition}
            onRemove={handleRemoveItem}
            selectedItem={currentItem}
            isOpen={isOpen}
            onClose={onClose}
            readOnly={formContext === undefined}
          />
        ) : (
          <CrossShipmentSelector
            selectedItem={currentItem}
            isOpen={isOpen}
            onClose={onClose}
            onSelect={handlePopulatePosition}
            onRemove={handleRemoveItem}
            childrenType='gridBox'
          />
        )}
      </Box>
    </VStack>
  );
};
