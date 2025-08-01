import { TreeData } from "@/components/visualisation/treeView";
import { selectUnassigned } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import { ChildSelectorProps } from "@/types/generic";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
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

interface ChildItemDetailsProps {
  childType: string;
  childData: TreeData<BaseShipmentItem>;
  childId: number;
  hasCheckbox?: boolean;
}

interface ChildItemDetailsFieldProps {
  value?: number | string | null;
  label: string;
  measurementUnit?: string;
}

const ChildItemDetailsField = ({ value, label, measurementUnit }: ChildItemDetailsFieldProps) => (
  <HStack w='100%' color='#686464'>
    <Text w='140px' fontWeight='800'>
      {label}:
    </Text>
    <Text>{value || "?"}</Text>
    {value && <Text>{measurementUnit}</Text>}
  </HStack>
);

const ChildItemDetails = ({
  childType,
  childData,
  childId,
  hasCheckbox = false,
}: ChildItemDetailsProps) => (
  <VStack w='100%' key={childId} borderBottom='1px solid' borderColor='diamond.200' py='10px'>
    <HStack w='100%'>
      <Stat>
        <StatLabel>{childType}</StatLabel>
        <StatNumber>{childData.name}</StatNumber>
        {childType === "Grid" && (
          <Grid w='100%' gap='0' templateColumns='repeat(2, 1fr)' mt='10px'>
            <ChildItemDetailsField
              label='Concentration'
              value={childData.data.concentration}
              measurementUnit='mg/ml'
            />
            <ChildItemDetailsField label='Buffer' value={childData.data.buffer} />
            <ChildItemDetailsField
              label='Support Material'
              value={childData.data.supportMaterial}
            />
            <ChildItemDetailsField label='Foil' value={childData.data.foil} />
            <ChildItemDetailsField label='Mesh' value={childData.data.mesh} />
            <ChildItemDetailsField label='Hole Diameter' value={childData.data.hole} />
          </Grid>
        )}
      </Stat>
      {hasCheckbox ? (
        <Checkbox value={childId.toString()} size='lg' />
      ) : (
        <Radio borderColor='black' value={childId.toString()} size='lg' />
      )}
    </HStack>
  </VStack>
);

export const ChildSelector = ({
  selectedItem,
  childrenType,
  onSelect,
  onRemove,
  readOnly = false,
  selectableChildren,
  acceptMultiple,
  ...props
}: ChildSelectorProps) => {
  const unassigned = useSelector(selectUnassigned);
  const childrenTypeData = useMemo(() => {
    const index = getCurrentStepIndex(childrenType);
    return { data: steps[index], index };
  }, [childrenType]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const unassignedItems: TreeData<BaseShipmentItem>[] | undefined | null = useMemo(() => {
    if (selectableChildren) {
      return selectableChildren;
    }

    return unassigned[0].children![childrenTypeData.index].children!.length
      ? unassigned[0].children![childrenTypeData.index].children
      : null;
  }, [unassigned, childrenTypeData, selectableChildren]);

  const handleItemSelected = useCallback(async () => {
    if (onSelect && selectedItems.length !== 0 && unassignedItems) {
      setIsLoading(true);

      if (acceptMultiple) {
        await onSelect(selectedItems.map((item) => unassignedItems[item]));
      } else {
        await onSelect(unassignedItems[selectedItems[0]]);
      }

      setIsLoading(false);
    }
    props.onClose();
  }, [onSelect, props, selectedItems, unassignedItems, acceptMultiple]);

  const handleRemoveClicked = useCallback(async () => {
    if (onRemove && selectedItem) {
      setIsLoading(true);
      await onRemove(selectedItem);
      setIsLoading(false);
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
      setSelectedItems([]);
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
            <VStack w='100%'>
              {unassignedItems && unassignedItems.length > 0 ? (
                acceptMultiple ? (
                  <CheckboxGroup onChange={(values) => setSelectedItems(values.map(Number))}>
                    {unassignedItems.map((item, i) => (
                      <ChildItemDetails
                        key={i}
                        childType={childrenTypeData.data.singular}
                        childData={item}
                        childId={i}
                        hasCheckbox={true}
                      />
                    ))}
                  </CheckboxGroup>
                ) : (
                  <RadioGroup w='100%' onChange={(index) => setSelectedItems([Number(index)])}>
                    {unassignedItems.map((item, i) => (
                      <ChildItemDetails
                        key={i}
                        childType={childrenTypeData.data.singular}
                        childData={item}
                        childId={i}
                      />
                    ))}
                  </RadioGroup>
                )
              ) : (
                <Text py='2' color='gray.600'>
                  No unassigned {childrenTypeData.data.title.toLowerCase()} available. Add a new{" "}
                  {childrenTypeData.data.singular.toLowerCase()} or remove a{" "}
                  {childrenTypeData.data.singular.toLowerCase()} from its container.
                </Text>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} bg='diamond.100' color='diamond.300'>
            Cancel
          </Button>
          <Button
            isDisabled={selectedItems === null}
            ml='0.5em'
            onClick={handleItemSelected}
            isLoading={isLoading}
          >
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
