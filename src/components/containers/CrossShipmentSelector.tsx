import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  Text,
  useToast,
  HStack,
  Radio,
  RadioGroup,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  Spacer,
  Box,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { authenticatedFetch } from "@/utils/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChildSelectorProps } from "@/types/generic";
import { getCurrentStepIndex, steps } from "@/mappings/pages";
import { selectUnassigned } from "@/features/shipment/shipmentSlice";
import { useSelector } from "react-redux";

const proposalPattern = /^([A-z]{2}[0-9]+)-([0-9]+)$/;

export const CrossShipmentSelector = ({
  onSelect,
  onRemove,
  selectedItem,
  childrenType,
  ...props
}: Omit<ChildSelectorProps, "readOnly">) => {
  const toast = useToast();
  const childrenTypeData = useMemo(() => {
    const index = getCurrentStepIndex(childrenType);
    return { data: steps[index], index };
  }, [childrenType]);
  const [radioIndex, setRadioIndex] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proposalReference, setProposalReference] = useState("");
  const [items, setItems] = useState<Record<string, any>[] | null | undefined>();
  const unassigned = useSelector(selectUnassigned);

  useEffect(() => {
    // Get unassigned containers
    let unassignedItems = unassigned[0].children![2].children;
    if (
      childrenTypeData.data.endpoint === "containers" &&
      unassignedItems &&
      unassignedItems.length > 0
    ) {
      unassignedItems = unassignedItems.filter((item) => item.data.type === childrenType);

      setItems(unassignedItems);
    }
  }, [unassigned, childrenType, childrenTypeData]);

  const onSessionSelect = useCallback(async () => {
    const proposalMatches = proposalPattern.exec(proposalReference);
    if (proposalMatches === null || proposalMatches.length !== 3) {
      toast({ title: "Invalid proposal reference provided", status: "error" });
      return;
    }

    const [, proposal, session] = proposalMatches;

    let endpoint = childrenTypeData.data.endpoint;
    if (childrenTypeData.data.endpoint === "containers") {
      endpoint += `?type=${childrenType}`;
    }
    setIsLoading(true);
    const res = await authenticatedFetch.client(
      `/proposals/${proposal}/sessions/${session}/${endpoint}`,
    );
    setIsLoading(false);

    if (res && res.status === 200) {
      const itemsJson = await res.json();
      setItems(itemsJson.items);
    } else {
      setItems(null);
    }
  }, [proposalReference, toast, childrenTypeData, childrenType]);

  const handleItemSelected = useCallback(async () => {
    if (onSelect && radioIndex !== null && items) {
      setIsLoading(true);
      const selectedItem = items[Number(radioIndex)];
      await onSelect({
        data: { type: selectedItem.type },
        name: selectedItem.name ?? "",
        id: selectedItem.id,
      });
      setIsLoading(false);
    }
    setItems(undefined);
    props.onClose();
  }, [items, radioIndex, onSelect, props]);

  const handleRemoveClicked = useCallback(async () => {
    if (onRemove && selectedItem) {
      setIsLoading(true);
      await onRemove(selectedItem);
      setIsLoading(false);
    }
    setItems(undefined);
    props.onClose();
  }, [onRemove, selectedItem, props]);

  return (
    <Modal size='2xl' {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select {childrenTypeData.data.singular}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedItem && (
            <Box mb='30px'>
              <HStack w='100%'>
                <Heading size='md'>Current {childrenTypeData.data.singular}</Heading>
                <Spacer />
                <Button onClick={handleRemoveClicked} bg='red.500' size='sm' isLoading={isLoading}>
                  Remove
                </Button>
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
            </Box>
          )}
          <Heading size='md'>Items</Heading>
          <Divider />
          <Text my='10px'>
            Select {childrenTypeData.data.singular.toLocaleLowerCase()} from existing shipment, or
            unassigned items
          </Text>
          <Text fontWeight='600'>Proposal Reference</Text>
          <Input
            variant='hi-contrast'
            value={proposalReference}
            onChange={(e) => setProposalReference(e.target.value)}
          />
          <Button w='150px' mt='1em' type='submit' isLoading={isLoading} onClick={onSessionSelect}>
            Select
          </Button>
          {items !== undefined ? (
            items !== null && items.length > 0 ? (
              <VStack w='100%' alignItems='start'>
                <RadioGroup w='100%' onChange={setRadioIndex}>
                  {items.map((item, i) => (
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
                <Button
                  isDisabled={radioIndex === null}
                  onClick={handleItemSelected}
                  isLoading={isLoading}
                >
                  Apply
                </Button>
              </VStack>
            ) : (
              <Heading variant='notFound' mt='20px' size='md' ml='0'>
                No {childrenTypeData.data.title.toLocaleLowerCase()} available for this session.
              </Heading>
            )
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
