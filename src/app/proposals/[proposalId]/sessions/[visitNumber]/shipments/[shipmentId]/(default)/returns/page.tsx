import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { Button, Divider, HStack, Heading, Link, Tag, Text, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "Shipment - Request Returns",
};

const getTopLevelContainers = async (shipmentId: string) => {
  const resTlc = await authenticatedFetch.server(`/shipments/${shipmentId}/topLevelContainers`);

  if (resTlc.status === 200) {
    return (await resTlc.json()).items;
  }

  return null;
};

const ReturnRequests = async ({ params }: { params: ShipmentParams }) => {
  const tlcData = await getTopLevelContainers(params.shipmentId);

  return (
    <VStack gap='0' alignItems='start' w='100%'>
      <Heading size='md' color='gray.600'>
        Shipment
      </Heading>
      <Heading>Request Dewar Returns</Heading>
      <Divider borderColor='gray.800' />
      <VStack alignItems='start' w='66%' my='1em'>
        <Text>
          Once your shipment has arrived at Diamond, you may request for it to be returned to your
          home facility. This request is processed by SynchWeb, and you will be taken to an external
          application to complete your return request.
        </Text>
        <Heading size='lg' mt='1em'>
          Available Dewars
        </Heading>
        <Divider borderColor='diamond.600' />
        <VStack
          alignItems='start'
          divider={<Divider borderColor='diamond.600' />}
          my='1em'
          gap='0.3em'
          w='100%'
        >
          {tlcData !== null && tlcData.length > 0 ? (
            tlcData.map((tlc: components["schemas"]["TopLevelContainerOut"]) => (
              <HStack w='100%' key={tlc.id}>
                <Heading flex='1 0 0' size='md'>
                  {tlc.name ?? "Unnamed Dewar"}
                </Heading>
                <Tag>{tlc.status ?? "Unknown"}</Tag>

                <Link href={`${process.env.SYNCHWEB_URL}/dewars/dispatch/${tlc.externalId}`}>
                  Request Return
                </Link>
              </HStack>
            ))
          ) : (
            <Heading variant='notFound'>No dewars found for this shipment</Heading>
          )}
        </VStack>
        <Button as={NextLink} href='-1'>
          Back
        </Button>
      </VStack>
    </VStack>
  );
};

export default ReturnRequests;
