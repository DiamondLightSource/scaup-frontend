import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import {
  Divider,
  HStack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import ShipmentHomeContent from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment - Sample Handling",
};

const getShipmentData = async (shipmentId: string) => {
  const res = await authenticatedFetch.server(`/shipments/${shipmentId}`);
  const resSamples = await authenticatedFetch.server(`/shipments/${shipmentId}/samples`);
  const data: components["schemas"]["ShipmentChildren"] =
    res && res.status === 200 ? await res.json() : null;

  if (data === null) {
    return data;
  }

  let counts: Record<string, number> = {};

  for (const [key, value] of Object.entries(recursiveCountTypeInstances(data.children))) {
    counts[pascalToSpace(key)] = value;
  }

  let samples = [];
  if (resSamples.status === 200) {
    samples = (await resSamples.json()).items;
  }

  return { counts, samples, dispatch: data.data, name: data.name };
};

const ShipmentHome = async ({ params }: { params: { shipmentId: string; proposalId: string } }) => {
  const shipmentData = await getShipmentData(params.shipmentId);

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          Shipment
        </Heading>
        <Heading>{shipmentData ? shipmentData.name : "Shipment"}</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      {shipmentData === null ? (
        <VStack w='100%' mt='3em'>
          <Heading variant='notFound'>Shipment Unavailable</Heading>
          <Text>This shipment does not exist or you do not have permission to view it.</Text>
        </VStack>
      ) : (
        <>
          <HStack w='100%' mb='1em'>
            <Stat borderBottom='3px solid' borderColor='diamond.700'>
              <StatLabel>Status</StatLabel>
              <StatNumber>{shipmentData.dispatch.status || "Unknown"}</StatNumber>
            </Stat>
            {Object.entries(shipmentData.counts).map(([key, value]) => (
              <Stat borderBottom='3px solid' borderColor='diamond.700' key={key}>
                <StatLabel>{key}</StatLabel>
                <StatNumber>{value}</StatNumber>
              </Stat>
            ))}
          </HStack>
          <ShipmentHomeContent params={params} data={shipmentData} />
        </>
      )}
    </VStack>
  );
};

export default ShipmentHome;
