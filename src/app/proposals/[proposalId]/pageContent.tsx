"use client";
import { DynamicForm } from "@/components/input/form";
import { DynamicFormEntry } from "@/components/input/form/input";
import { components } from "@/types/schema";
import { Item } from "@/utils/client/item";
import {
  Button,
  Divider,
  Grid,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export interface ProposalOverviewProps {
  proposalId: string;
  data: components["schemas"]["Paged_MixedShipment_"]["items"] | null;
}

interface ShipmentData {
  name: string;
}

const shipmentForm = [
  { id: "name", label: "Name", type: "text", validation: { required: "Required" } },
] as DynamicFormEntry[];

export const ProposalOverviewContent = ({ proposalId, data }: ProposalOverviewProps) => {
  const router = useRouter();
  const formContext = useForm<ShipmentData>();

  const onSubmit = formContext.handleSubmit(async (info: ShipmentData) => {
    const newShipment = await Item.create(proposalId, { name: info.name }, "shipments");

    router.push(`/proposals/${proposalId}/shipments/${newShipment.id}/edit`);
  });

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {proposalId}
        </Heading>
        <Heading>Proposal</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%'>
        <Text fontSize='18px' mt='2'>
          View existing shipments for this proposal, or add new shipments.
        </Text>{" "}
        <Heading mt='3' size='lg' color='grey.700'>
          Select Existing Shipment
        </Heading>
      </VStack>
      {data ? (
        <>
          <Grid templateColumns='repeat(5,1fr)' gap='4px' w='100%'>
            {data.map((shipment, i) => (
              <Link href={`${proposalId}/shipments/${shipment.id}`} key={i}>
                <Stat
                  key={i}
                  _hover={{
                    borderColor: "diamond.400",
                  }}
                  bg='white'
                  overflow='hidden'
                  p={2}
                  border='1px solid grey'
                  borderRadius={5}
                  w='100%'
                  cursor='pointer'
                >
                  <StatLabel>
                    <Tag colorScheme={shipment.creationStatus === "submitted" ? "green" : "gray"}>
                      {shipment.creationStatus === "submitted" ? "Submitted" : "Draft"}
                    </Tag>
                  </StatLabel>
                  <StatNumber>
                    <Text whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                      {shipment.name ?? "No Name"}
                    </Text>
                  </StatNumber>
                  <StatHelpText mb='0'>
                    <b>Created: </b>
                    {shipment.creationDate ?? "?"}
                  </StatHelpText>
                </Stat>
              </Link>
            ))}
          </Grid>
          <Heading size='md' borderLeft='3px solid' p='0.5em' my='0.5em' borderColor='diamond.800'>
            or
          </Heading>
        </>
      ) : (
        <Text fontWeight='600'>This proposal has no shipments assigned to it yet. You can:</Text>
      )}
      <FormProvider {...formContext}>
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20em",
            flex: "1 0 auto",
          }}
        >
          <Heading mt='3' mb='0.5em' size='lg' color='grey.700'>
            Create New Shipment
          </Heading>
          <DynamicForm formType={shipmentForm} />
          <Button w='150px' mt='1em' type='submit' bg='green.500'>
            Create
          </Button>
        </form>
      </FormProvider>
    </VStack>
  );
};
