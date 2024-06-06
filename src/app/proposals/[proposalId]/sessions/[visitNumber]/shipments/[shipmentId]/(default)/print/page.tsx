import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { ShipmentParams } from "@/types/generic";
import { getPrepopData } from "@/utils/client";
import { getShipmentData } from "@/utils/client/shipment";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Divider,
  HStack,
  Heading,
  Link,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";
import SubmissionOverviewContent, { PrintButton } from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment Overview - Sample Handling",
};

const SubmissionOverview = async ({ params }: { params: ShipmentParams }) => {
  const rawShipmentData = (await getShipmentData(params.shipmentId)) as TreeData<BaseShipmentItem>;
  const unassignedData = await getShipmentData(params.shipmentId, "/unassigned");
  const prepopData = await getPrepopData(params.proposalId);
  let hasUnassigned = false;

  if (unassignedData) {
    hasUnassigned = Object.values(unassignedData).some((array) => array.length > 0);
  }

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <HStack w='100%'>
          <Heading>Shipment Items</Heading>
          <Spacer />
          <PrintButton />
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      {hasUnassigned && (
        <Alert status='info' variant='info'>
          <AlertIcon />
          <AlertDescription>
            This shipment contains unassigned items, which are not included in this listing.
          </AlertDescription>
        </Alert>
      )}
      {rawShipmentData !== null ? (
        <SubmissionOverviewContent shipment={rawShipmentData} prepopData={prepopData} />
      ) : (
        <VStack mt='2em' alignItems='start'>
          <Heading size='lg'>No assigned items</Heading>
          <Text>
            This shipment contains <b>no assigned items</b>. You must{" "}
            <Link as={NextLink} href='edit'>
              add at least one item
            </Link>{" "}
            to this shipment to get a list of contents.
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

export default SubmissionOverview;
