import { ShipmentParams } from "@/types/generic";
import { authenticatedFetch } from "@/utils/client";
import { Divider, HStack, Heading, Spacer, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import { PrintButton } from "../pageContent";
import { DynamicFormView } from "@/components/visualisation/formView";

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
      <VStack alignItems='start' w='100%'>
        {preSessionData ? (
          <DynamicFormView
            formType='preSession'
            data={preSessionData}
            prepopData={preSessionData}
          />
        ) : (
          <Heading w='100%' py='1em' variant='notFound'>
            No pre-session information available
          </Heading>
        )}
      </VStack>
    </VStack>
  );
};

export default PreSession;
