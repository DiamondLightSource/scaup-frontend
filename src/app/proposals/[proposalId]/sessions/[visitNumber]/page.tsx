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
  title: "Session - Scaup",
};

const VALID_SHIPMENT_STATUSES: Record<string, string> = {
  "at facility": "green",
  "awb created": "purple",
  "dispatch-requested": "purple",
  opened: "green",
  "pickup booked": "purple",
  "pickup cancelled": "red",
  processing: "green",
  "sent to facility": "green",
  "transfer-requested": "purple",
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

const getShipmentStatus = (shipment: components["schemas"]["ShipmentOut"]) => {
  if (shipment.status === null || shipment.status === undefined) {
    const creationStatus = shipment.externalId ? "Submitted" : "Draft";
    return {
      colour: creationStatus === "Submitted" ? "green" : "gray",
      statusText: creationStatus,
    };
  }

  return {
    colour: VALID_SHIPMENT_STATUSES[shipment.status] || "gray",
    statusText: shipment.status,
  };
};

const SessionOverview = async (props: { params: Promise<SessionParams> }) => {
  const params = await props.params;
  const data = (await getShipments(params.proposalId, params.visitNumber)) as
    | components["schemas"]["ShipmentOut"][]
    | null;

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}-{params.visitNumber}
        </Heading>
        <Heading>Session Samples Dashboard</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      {data === null ? (
        <VStack w='100%' mt='3em'>
          <Heading variant='notFound'>Session Unavailable</Heading>
          <Text>This session does not exist or you do not have permission to view it.</Text>
        </VStack>
      ) : (
        <>
          <VStack alignItems='start' w='100%'>
            <Text fontSize='18px' mt='2'>
              View existing sample collections for this session, or add new sample collections.
            </Text>{" "}
            <Heading mt='3' size='lg' color='grey.700'>
              Select Existing Sample Collection
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
                        <Tag colorScheme={getShipmentStatus(shipment).colour}>
                          {getShipmentStatus(shipment).statusText}
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
              This session has no sample collections assigned to it yet. You can:
            </Text>
          )}
          <ShipmentCreationForm proposalId={params.proposalId} visitNumber={params.visitNumber} />
        </>
      )}
    </VStack>
  );
};

export default SessionOverview;
