import { ShipmentCard } from "@/components/navigation/ShipmentCard";
import { getShipmentStatus } from "@/mappings/colours";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { formatDate } from "@/utils/generic";
import { Divider, Heading, HStack, Tag, VStack } from "@chakra-ui/react";
import { Pagination, Table, TwoLineLink } from "@diamondlightsource/ui-components";
import Link from "next/link";

const getProposalShipments = async (proposalReference: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalReference}/shipments`);

  if (res && res.status === 200) {
    const shipments: components["schemas"]["Paged_ShipmentOut_"] = await res.json();
    return {
      ...shipments,
      items: shipments.items.map((shipment) => ({
        ...shipment,
        visitNumber: (
          <Link color='diamond.600' href=''>
            {shipment.visitNumber}
          </Link>
        ),
        creationDate: shipment.creationDate ? formatDate(shipment.creationDate) : "Unknown",
        status: (
          <Tag colorScheme={getShipmentStatus(shipment).colour}>
            {getShipmentStatus(shipment).statusText}
          </Tag>
        ),
      })),
    };
  }

  return null;
};

const ProposalPage = async (props: { params: Promise<{ proposalId: string }> }) => {
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
        {/*{shipments ? (
          <VStack flex='1 0 0'>
            {shipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </VStack>
        ) : (
          <p>Test</p>
        )}*/}
        <VStack flex='1 0 0' alignItems='start'>
          <Heading size='lg'>Shipments</Heading>
          <Divider />
          {shipments && shipments.items && (
            <Table
              w='100%'
              data={shipments.items}
              headers={[
                { key: "visitNumber", label: "Session" },
                { key: "name", label: "Name" },
                { key: "status", label: "Status" },
                { key: "creationDate", label: "Creation Date" },
                { key: "comments", label: "Comments" },
              ]}
            />
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

export default ProposalPage;
