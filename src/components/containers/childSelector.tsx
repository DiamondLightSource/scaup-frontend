import { TreeData } from "@/components/visualisation/treeView";
import { selectUnassigned } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import {
  Box,
  Button,
  Divider,
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
  Radio,
  RadioGroup,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

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
  const [radioIndex, setRadioIndex] = useState<string | null>(null);

  const unassignedItems: TreeData<BaseShipmentItem>[] | undefined | null = useMemo(() => {
    return unassigned[0].children![childrenTypeData.index].children!.length
      ? unassigned[0].children![childrenTypeData.index].children
      : null;
  }, [unassigned, childrenTypeData]);

  const handleItemSelected = useCallback(() => {
    if (onSelect && radioIndex !== null && unassignedItems) {
      onSelect(unassignedItems[Number(radioIndex)]);
    }
    props.onClose();
  }, [onSelect, props, radioIndex, unassignedItems]);

  const handleRemoveClicked = useCallback(() => {
    if (onRemove && selectedItem) {
      onRemove(selectedItem);
    }
    props.onClose();
  }, [onRemove, selectedItem, props]);

  useEffect(() => {
    /*
     * Since this component is not conditionally rendered, and is tied to the lifecycle of the parent
     * container component, it does not get "rerendered". Therefore, status is retained across open/close cycles,
     * and this needs to be handled appropriately.
     */
    if (!props.isOpen) {
      setRadioIndex(null);
    }
  }, [props.isOpen]);

  return (
    <Modal size='2xl' {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select {childrenTypeData.data.singular}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedItem && (
            <Box>
              <HStack w='100%'>
                <Heading size='md'>Current {childrenTypeData.data.singular}</Heading>
                <Spacer />
                {!readOnly && (
                  <Button onClick={handleRemoveClicked} bg='red.500' size='sm'>
                    Remove
                  </Button>
                )}
              </HStack>
              <Divider />
              <HStack
                my='2'
                p='0.5em'
                borderRadius='0'
                borderBottom='1px solid'
                borderColor='diamond.800'
                color='diamond.75'
                bg='diamond.600'
              >
                <Stat>
                  <StatLabel>{childrenTypeData.data.singular}</StatLabel>
                  <StatNumber>{selectedItem.name}</StatNumber>
                </Stat>
              </HStack>
              {!readOnly && (
                <>
                  <Heading mt='30px' size='md'>
                    Available {childrenTypeData.data.title}
                  </Heading>
                  <Divider />
                </>
              )}
            </Box>
          )}
          {!readOnly && (
            <>
              {unassignedItems && unassignedItems.length > 0 ? (
                <VStack w='100%'>
                  <RadioGroup w='100%' onChange={setRadioIndex}>
                    {unassignedItems.map((item, i) => (
                      <HStack
                        w='100%'
                        key={item.id}
                        borderBottom='1px solid'
                        borderColor='diamond.200'
                        py='10px'
                      >
                        <Stat>
                          <StatLabel>{childrenTypeData.data.singular}</StatLabel>
                          <StatNumber>{item.name}</StatNumber>
                        </Stat>
                        <Radio borderColor='black' value={i.toString()} size='lg' />
                      </HStack>
                    ))}
                  </RadioGroup>
                </VStack>
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
          <Button onClick={props.onClose} bg='diamond.100' color='diamond.300'>
            Cancel
          </Button>
          <Button isDisabled={radioIndex === null} ml='0.5em' onClick={handleItemSelected}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
