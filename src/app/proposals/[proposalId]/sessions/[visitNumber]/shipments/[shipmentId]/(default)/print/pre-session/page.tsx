import PreSessionContent from "@/app/proposals/[proposalId]/sessions/[visitNumber]/shipments/[shipmentId]/(default)/print/pre-session/pageContent";
import { ShipmentParams } from "@/types/generic";
import { authenticatedFetch } from "@/utils/client";
import { Divider, HStack, Heading, Spacer, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import { PrintButton } from "../pageContent";

export const metadata: Metadata = {
  title: "Pre Session - Scaup",
};

const getPreSessionData = async (shipmentId: string) => {
  const resPreSession = await authenticatedFetch.server(`/shipments/${shipmentId}/preSession`);

  if (resPreSession.status === 200) {
    return (await resPreSession.json()).details;
  } else {
    return null;
  }
};

const PreSession = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const preSessionData = await getPreSessionData(params.shipmentId);
  return (
    <VStack gap='0' alignItems='start' w='100%'>
      <Heading size='md' color='gray.600'>
        {params.proposalId}
      </Heading>
      <HStack w='100%'>
        <Heading>Pre-Session Information</Heading>
        <Spacer />
        <PrintButton />
      </HStack>
      <Divider borderColor='gray.800' />
      <PreSessionContent data={preSessionData} />;
    </VStack>
  );
};

export default PreSession;
