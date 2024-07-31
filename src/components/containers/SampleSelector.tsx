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
import { useCallback, useState } from "react";
import { components } from "@/types/schema";
import { BaseChildSelectorProps } from "@/types/generic";

const proposalPattern = /^([A-z]{2}[0-9]+)-([0-9]+)$/;

export const SampleSelector = ({
  onSelect,
  onRemove,
  selectedItem,
  ...props
}: BaseChildSelectorProps) => {
  const toast = useToast();
  const [radioIndex, setRadioIndex] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proposalReference, setProposalReference] = useState("");
  const [samples, setSamples] = useState<components["schemas"]["SampleOut"][] | null | undefined>();

  const onSessionSelect = useCallback(async () => {
    const proposalMatches = proposalPattern.exec(proposalReference);
    if (proposalMatches === null || proposalMatches.length !== 3) {
      toast({ title: "Invalid proposal reference provided", status: "error" });
      return;
    }

    const [, proposal, session] = proposalMatches;

    setIsLoading(true);
    const res = await authenticatedFetch.client(
      `/proposals/${proposal}/sessions/${session}/samples`,
    );
    setIsLoading(false);

    if (res && res.status === 200) {
      const samplesJson = await res.json();
      setSamples(samplesJson.items);
    } else {
      setSamples(null);
    }
  }, [proposalReference, toast]);

  const handleItemSelected = useCallback(async () => {
    if (onSelect && radioIndex !== null && samples) {
      setIsLoading(true);
      const selectedSample = samples[Number(radioIndex)];
      await onSelect({
        data: { type: selectedSample.type },
        name: selectedSample.name ?? "",
        id: selectedSample.id,
      });
      setIsLoading(false);
    }
    props.onClose();
  }, [samples, radioIndex, onSelect, props]);

  const handleRemoveClicked = useCallback(async () => {
    if (onRemove && selectedItem) {
      setIsLoading(true);
      await onRemove(selectedItem);
      setIsLoading(false);
    }
    props.onClose();
  }, [onRemove, selectedItem, props]);

  return (
    <Modal size='2xl' {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Sample</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedItem && (
            <Box>
              <HStack w='100%'>
                <Heading size='md'>Current Sample</Heading>
                <Spacer />
                <Button onClick={handleRemoveClicked} bg='red.500' size='sm'>
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
                  <StatLabel>Sample</StatLabel>
                  <StatNumber>{selectedItem.name}</StatNumber>
                </Stat>
              </HStack>
              <Heading mt='30px' size='md'>
                Select Sample from Existing Shipment
              </Heading>
              <Divider />
            </Box>
          )}
          <Text fontWeight='600'>Proposal Reference</Text>
          <Input
            variant='hi-contrast'
            value={proposalReference}
            onChange={(e) => setProposalReference(e.target.value)}
          />
          <Button w='150px' mt='1em' type='submit' isLoading={isLoading} onClick={onSessionSelect}>
            Select
          </Button>
          {samples && (
            <VStack w='100%'>
              <RadioGroup w='100%' onChange={setRadioIndex}>
                {samples.map((item, i) => (
                  <HStack
                    w='100%'
                    key={item.id}
                    borderBottom='1px solid'
                    borderColor='diamond.200'
                    py='10px'
                  >
                    <Stat>
                      <StatLabel>Sample</StatLabel>
                      <StatNumber>{item.name}</StatNumber>
                    </Stat>
                    <Radio borderColor='black' value={i.toString()} size='lg' />
                  </HStack>
                ))}
              </RadioGroup>
              <Button
                isDisabled={radioIndex === null}
                ml='0.5em'
                onClick={handleItemSelected}
                isLoading={isLoading}
              >
                Apply
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
