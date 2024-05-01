import { ShipmentCreationForm } from "@/app/proposals/[proposalId]/sessions/[visitNumber]/pageContent";
import { SessionParams } from "@/types/generic";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import {
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
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proposal - Sample Handling",
};

const getShipments = async (proposalId: string, visitNumber: string) => {
  const res = await authenticatedFetch.server(
    `/proposals/${proposalId}/sessions/${visitNumber}/shipments`,
  );

  if (res && res.status === 200) {
    const shipments = await res.json();
    return shipments.items;
  }

  return null;
};

const ProposalOverview = async ({ params }: { params: SessionParams }) => {
  const data = (await getShipments(params.proposalId, params.visitNumber)) as
    | components["schemas"]["MixedShipment"][]
    | null;

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <Heading>Proposal</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      {data === null ? (
        <VStack w='100%' mt='3em'>
          <Heading variant='notFound'>Proposal Unavailable</Heading>
          <Text>This proposal does not exist or you do not have permission to view it.</Text>
        </VStack>
      ) : (
        <>
          <VStack alignItems='start' w='100%'>
            <Text fontSize='18px' mt='2'>
              View existing shipments for this proposal, or add new shipments.
            </Text>{" "}
            <Heading mt='3' size='lg' color='grey.700'>
              Select Existing Shipment
            </Heading>
          </VStack>
          {data.length > 0 ? (
            <>
              <Grid templateColumns='repeat(5,1fr)' gap='4px' w='100%'>
                {data.map((shipment, i) => (
                  <Link href={`${params.visitNumber}/shipments/${shipment.id}`} key={i}>
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
                        <Tag
                          colorScheme={shipment.creationStatus === "submitted" ? "green" : "gray"}
                        >
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
              <Heading
                size='md'
                borderLeft='3px solid'
                p='0.5em'
                my='0.5em'
                borderColor='diamond.800'
              >
                or
              </Heading>
            </>
          ) : (
            <Text fontWeight='600'>
              This proposal has no shipments assigned to it yet. You can:
            </Text>
          )}
          <ShipmentCreationForm proposalId={params.proposalId} visitNumber={params.visitNumber} />
        </>
      )}
    </VStack>
  );
};

export default ProposalOverview;
