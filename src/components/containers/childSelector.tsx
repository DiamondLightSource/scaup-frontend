import { TreeData } from "@/components/visualisation/treeView";
import { selectUnassigned } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import {
  Box,
  Button,
  Card,
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
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export interface ChildSelectorProps extends Omit<ModalProps, "children"> {
  /** Currently selected item for container position */
  selectedItem?: TreeData<PositionedItem> | null;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<BaseShipmentItem>) => void;
  /** Callback for item removal revent */
  onRemove?: (child: TreeData<PositionedItem>) => void;
}

export const ChildSelector = ({
  selectedItem,
  onSelect,
  onRemove,
  ...props
}: ChildSelectorProps) => {
  const unassigned = useSelector(selectUnassigned);

  // TODO: make this work for non-samples
  const unassignedSamples: TreeData<BaseShipmentItem>[] | undefined | null = useMemo(
    () =>
      unassigned[0].children![0].children!.length ? unassigned[0].children![0].children : null,
    [unassigned],
  );

  const handleSampleClicked = useCallback(
    (sample: TreeData<BaseShipmentItem>) => {
      if (onSelect) {
        onSelect(sample);
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
                <Button onClick={handleRemoveClicked} bg='red.500' size='sm'>
                  Remove
                </Button>
              </HStack>
              <Divider />
              <Card
                variant='filled'
                my='2'
                borderRadius='0'
                backgroundColor='diamond.800'
                color='white'
              >
                <Stat>
                  <StatLabel>Sample</StatLabel>
                  <StatNumber>{selectedItem.label}</StatNumber>
                </Stat>
              </Card>
            </Box>
          )}
          <Heading size='md'>Available Items</Heading>
          <Divider />
          {unassignedSamples ? (
            <Grid py='2' templateColumns='repeat(4, 1fr)' gap='2'>
              {unassignedSamples.map((sample) => (
                <Card onClick={() => handleSampleClicked(sample)} key={sample.id}>
                  <Stat>
                    <StatLabel>Sample</StatLabel>
                    <StatNumber>{sample.label}</StatNumber>
                  </Stat>
                </Card>
              ))}
            </Grid>
          ) : (
            <Text py='2' color='gray.600'>
              No unassigned samples available. Add new samples or remove existing samples from their
              containers.
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
