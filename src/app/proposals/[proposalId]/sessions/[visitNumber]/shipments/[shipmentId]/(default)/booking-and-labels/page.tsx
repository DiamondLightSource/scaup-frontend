import { ShipmentParams } from "@/types/generic";
import { serverFetch } from "@/utils/server/request";
import {
  Button,
  Divider,
  HStack,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";
import { ArrangeShipmentButton } from "@/components/navigation/ArrangeShipmentButton";

export const metadata: Metadata = {
  title: "Booking & Labels - Scaup",
};

const getIsBooked = async (shipmentId: string) => {
  const res = await serverFetch(`/shipments/${shipmentId}`);
  const data = res && res.status === 200 ? await res.json() : [];

  return data && !!data.data.shipmentRequest;
};

const BookingAndLabelsPage = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const isBooked = await getIsBooked(params.shipmentId);

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <HStack w='100%'>
          <Heading>Shipment Booking & Labels</Heading>
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w={{ base: "100%", md: "66%" }}>
        <Text mb='2em'>
          If you have already submitted your sample information, and you are sure you do not wish to
          make any changes, you can follow the below steps to finalise the shipping process:
        </Text>
        <List spacing='3em'>
          <ListItem>
            <Heading size='lg'>Tracking labels</Heading>
            <Text mt='1em'>
              Print tracking labels and affix them to the outside of the dewar and dewar case. If
              you are sending multiple dewars, ensure the code on the label matches the code on the
              dewar.
            </Text>
            <Text my='1em'>
              If a dewar doesn&#39;t have a barcode (such as the ones on the last page) already, cut
              out the barcode on the last page and affix it to the dewar. If you&#39;re sending
              multiple dewars, ensure the dewar matches the barcode you&#39;ve selected for it
              previously.
            </Text>
            <NextLink
              href={`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/tracking-labels`}
            >
              <Button>Print Tracking Labels</Button>
            </NextLink>
          </ListItem>
          <ListItem>
            <Heading size='lg'>Book shipment with courier (optional)</Heading>
            <Text my='1em'>
              You can arrange for your samples to be shipped using Diamond&#39;s DHL account, or you
              can do it yourself with your courier of choice. Remember to{" "}
              <b>affix the airway bill/courier label to the outside of the dewar case</b> in either
              case.
            </Text>
            <ArrangeShipmentButton params={params} isBooked={isBooked} />
          </ListItem>
          <ListItem>
            <Heading size='lg'>Request dewar return at the end of your session</Heading>
            <Text my='1em'>
              Once your session is finished, you must{" "}
              <Link as={NextLink} href='dewar-logistics'>
                request for your dewars to be returned
              </Link>{" "}
              if you wish for them to be returned to your institution.
            </Text>
            <Text my='1em'>
              If you have already printed the tracking label, you do not need to do so again once
              you have submitted your dispatch request.
            </Text>
          </ListItem>
        </List>
      </VStack>
    </VStack>
  );
};

export default BookingAndLabelsPage;
