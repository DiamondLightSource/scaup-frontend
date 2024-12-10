import ImportSamplesPageContent from "./pageContent";
import { ShipmentParams } from "@/types/generic";
import { Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Existing Samples - Scaup",
};

const SubmissionOverview = async (props: {
  params: Promise<ShipmentParams>;
  searchParams: Promise<{ new: string }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}-{params.visitNumber}
        </Heading>
        <Heading>Import Existing Samples</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%' gap='1em'>
        <Text>
          Import existing samples from other sample collections, for use in this sample collection.
          Ensure your sample is already being stored at eBIC.
        </Text>
      </VStack>
      <ImportSamplesPageContent params={params} isNew={searchParams.new === "true"} />
    </VStack>
  );
};

export default SubmissionOverview;
