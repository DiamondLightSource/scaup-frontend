import { ShipmentParams } from "@/types/generic";
import { Divider, Heading, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import PreSessionContent from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment - Sample Handling",
};

const ShipmentHome = async ({ params }: { params: ShipmentParams }) => {
  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}-{params.visitNumber}
        </Heading>
        <Heading>Pre-Session Information</Heading>
        <Divider borderColor='gray.800' />
        <PreSessionContent />
      </VStack>
    </VStack>
  );
};

export default ShipmentHome;
