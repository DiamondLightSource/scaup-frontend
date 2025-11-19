import { ShipmentCard } from "@/components/navigation/ShipmentCard";
import { getShipmentStatus } from "@/mappings/colours";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { formatDate } from "@/utils/generic";
import { Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Pagination, Table, TwoLineLink } from "@diamondlightsource/ui-components";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proposal Sample Collections - SCAUP",
};

const getProposalShipments = async (proposalReference: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalReference}/shipments`);

  if (res && res.status === 200) {
    const shipments: components["schemas"]["Paged_ShipmentOut_"] = await res.json();
    return {
      ...shipments,
      items: shipments.items.map((shipment) => ({
        ...shipment,
        creationDate: shipment.creationDate ? formatDate(shipment.creationDate) : "Unknown",
      })),
    };
  }

  return null;
};

const ProposalShipmentsPage = async (props: { params: Promise<{ proposalId: string }> }) => {
  const { proposalId } = await props.params;
  const shipments = await getProposalShipments(proposalId);

  return (
    <VStack w='100%'>
      <VStack w='100%' gap='0' alignItems='start'>
        <Heading size='md' color='gray.600'>
          {proposalId}
        </Heading>
        <Heading>Proposal Sample Collections</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <HStack w='100%' alignItems='start' gap='2em'>
        <VStack flex='1 0 0' alignItems='start'>
          <Heading size='lg'>Shipments</Heading>
          <Divider />
          {shipments && shipments.items && shipments.items.length > 0 ? (
            <VStack flex='1 0 0' w='100%'>
              {shipments.items.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </VStack>
          ) : (
            <Heading variant="notFound" size="md">No shipments found</Heading>
          )}
        </VStack>
        <VStack alignItems='start' flexBasis='400px'>
          <Heading size='lg'>Actions</Heading>
          <Divider />
          <TwoLineLink
            title='View sessions in PATo'
            href={`${process.env.PATO_URL}/proposals/${proposalId}`}
          >
            View session list in PATo
          </TwoLineLink>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ProposalShipmentsPage;
