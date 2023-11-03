import { TreeData } from "@/components/visualisation/treeView";
import { selectUnassigned } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import {
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { GenericChildCard } from "./child";

export interface ChildSelectorProps extends Omit<ModalProps, "children"> {
  /** Currently selected item for container position */
  selectedItem?: TreeData<PositionedItem> | null;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<BaseShipmentItem>) => void;
  /** Callback for item removal revent */
  onRemove?: (child: TreeData<PositionedItem>) => void;
  /** Type of container's children */
  childrenType: BaseShipmentItem["type"];
  /** Disable editing controls */
  readOnly?: boolean;
}

export const ChildSelector = ({
  selectedItem,
  childrenType,
  onSelect,
  onRemove,
  readOnly = false,
  ...props
}: ChildSelectorProps) => {
  const unassigned = useSelector(selectUnassigned);
  const childrenTypeData = useMemo(() => {
    const index = getCurrentStepIndex(childrenType);
    return { data: steps[index], index };
  }, [childrenType]);

  // TODO: make this work for non-samples
  const unassignedSamples: TreeData<BaseShipmentItem>[] | undefined | null = useMemo(() => {
    return unassigned[0].children![childrenTypeData.index].children!.length
      ? unassigned[0].children![childrenTypeData.index].children
      : null;
  }, [unassigned, childrenTypeData]);

  const handleSampleClicked = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      if (onSelect) {
        onSelect(item);
      }
      props.onClose();
    },
    [onSelect, props],
  );

  const handleRemoveClicked = useCallback(() => {
    if (onRemove && selectedItem) {
      onRemove(selectedItem);
    }
    props.onClose();
  }, [onRemove, selectedItem, props]);

  return (
    <Modal size='2xl' {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedItem && (
            <Box mb='20px'>
              <HStack w='100%'>
                <Heading size='md'>Current Item</Heading>
                <Spacer />
                {!readOnly && (
                  <Button onClick={handleRemoveClicked} bg='red.500' size='sm'>
                    Remove
                  </Button>
                )}
              </HStack>
              <Divider />
              <GenericChildCard name={selectedItem.name} type={childrenTypeData.data.singular} />
            </Box>
          )}
          {!readOnly && (
            <>
              <Heading size='md'>Available Items</Heading>
              <Divider />
              {unassignedSamples ? (
                <Grid py='2' templateColumns='repeat(4, 1fr)' gap='2'>
                  {unassignedSamples.map((item) => (
                    <GenericChildCard
                      onClick={() => handleSampleClicked(item)}
                      key={item.id}
                      name={item.name}
                      type={childrenTypeData.data.singular}
                    />
                  ))}
                </Grid>
              ) : (
                <Text py='2' color='gray.600'>
                  No unassigned {childrenTypeData.data.title.toLowerCase()} available. Add a new{" "}
                  {childrenTypeData.data.singular.toLowerCase()} or remove a{" "}
                  {childrenTypeData.data.singular.toLowerCase()} from its container.
                </Text>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
