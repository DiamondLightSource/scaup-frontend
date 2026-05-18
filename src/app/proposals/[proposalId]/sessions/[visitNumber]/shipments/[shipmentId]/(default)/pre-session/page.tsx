import { Shipment, ShipmentParams } from "@/types/generic";
import { Divider, Heading, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import PreSessionContent from "./pageContent";
import { serverFetch } from "@/utils/server/request";
import { getShipmentData } from "@/utils/server/shipment";

export const metadata: Metadata = {
  title: "Pre-Session Data - Scaup",
};

const getPreSessionData = async (shipmentId: string) => {
  const res = await serverFetch(`/shipments/${shipmentId}/preSession`);
  return res && res.status === 200 ? (await res.json()).details : null;
};

const PreSession = async (props: {
  params: Promise<ShipmentParams>;
  searchParams: Promise<{ skipPush: boolean }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const preSessionInfo = await getPreSessionData(params.shipmentId);
  const shipment = await getShipmentData(params.shipmentId);
  const shipmentType = (shipment?.data as Shipment).sessionType.name ?? "TEM";
  
  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}-{params.visitNumber}
        </Heading>
        <Heading>Pre-Session Information</Heading>
        <Divider borderColor='gray.800' />
        <PreSessionContent
          params={params}
          shipmentType={shipmentType}
          prepopData={preSessionInfo}
          skipPush={searchParams && searchParams.skipPush}
        />
      </VStack>
    </VStack>
  );
};

export default PreSession;
