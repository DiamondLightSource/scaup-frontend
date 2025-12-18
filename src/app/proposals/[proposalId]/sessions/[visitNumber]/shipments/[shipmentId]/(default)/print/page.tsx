import { TreeData } from "@/components/visualisation/treeView";
import { ShipmentParams } from "@/types/generic";
import { getPrepopData } from "@/utils/server/request";
import { getShipmentData } from "@/utils/server/shipment";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Divider,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";
import SubmissionOverviewContent, { PrintButton } from "./pageContent";
import { allItemsEmptyInDict } from "@/utils/generic";

export const metadata: Metadata = {
  title: "Sample Collection Overview - Scaup",
};

const SubmissionOverview = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const rawShipmentData = (await getShipmentData(params.shipmentId)) as TreeData;
  const unassignedData = (await getShipmentData(params.shipmentId, "/unassigned")) as Record<
    string,
    any
  >;
  const prepopData = await getPrepopData(params.proposalId);
  let hasUnassigned = false;

  if (unassignedData) {
    hasUnassigned = allItemsEmptyInDict(unassignedData);
  }

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <HStack w='100%'>
          <Heading>Sample Collection Items</Heading>
          <Spacer />
          <PrintButton />
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      {hasUnassigned && (
        <Alert status='info' variant='info'>
          <AlertIcon />
          <AlertDescription>
            This sample collection contains unassigned items, which are not included in this
            listing.
          </AlertDescription>
        </Alert>
      )}
      {rawShipmentData !== null ? (
        <SubmissionOverviewContent shipment={rawShipmentData} prepopData={prepopData} />
      ) : (
        <VStack mt='2em' alignItems='start'>
          <Heading size='lg'>No assigned items</Heading>
          <Text>
            This sample collection contains <b>no assigned items</b>. You must{" "}
            <NextLink href='edit'>add at least one item</NextLink> to this sample collection to get
            a list of contents.
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

export default SubmissionOverview;
