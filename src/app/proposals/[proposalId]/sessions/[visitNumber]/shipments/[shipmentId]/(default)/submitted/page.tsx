import { DynamicFormEntry } from "@/types/forms";
import { DynamicFormView } from "@/components/visualisation/formView";
import { ShipmentParams } from "@/types/generic";
import NextLink from "next/link";
import { pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import { getShipmentData } from "@/utils/server/shipment";
import { ShippingInstructions } from "./pageContent";

export const metadata: Metadata = {
  title: "Sample Collection Submitted - Scaup",
};

const getShipment = async (shipmentId: string) => {
  const data = await getShipmentData(shipmentId);

  if (data === null) {
    return null;
  }

  const counts = recursiveCountTypeInstances(data.children);
  const formModel: DynamicFormEntry[] = Object.keys(counts).map((key) => ({
    id: key,
    label: pascalToSpace(key),
    type: "text",
  }));

  return { counts, formModel, isBooked: !!(data && data.data.shipmentRequest) };
};

const SubmissionOverview = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const shipmentData = await getShipment(params.shipmentId);

  if (shipmentData === null) {
    return (
      <VStack w='100%' mt='3em'>
        <Heading variant='notFound'>Sample Collection Unavailable</Heading>
        <Text>This sample collection does not exist or you do not have permission to view it.</Text>
        <NextLink href='..'>Return to session page</NextLink>
      </VStack>
    );
  }

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}-{params.visitNumber}
        </Heading>
        <Heading>Sample Collection Overview</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%' gap='1em'>
        <Text fontSize='18px' my='1em'>
          Your sample information was <b>successfully submitted!</b> You may{" "}
          {Object.keys(shipmentData.counts).length > 0 &&
            "now arrange for your samples to be shipped to Diamond, "}
          <Link
            textDecoration='underline'
            color='diamond.600'
            href={`/proposals/${params.proposalId}/sessions/${params.visitNumber}/shipments/${params.shipmentId}`}
          >
            return to the sample collection summary
          </Link>
          , or{" "}
          <Link
            textDecoration='underline'
            color='diamond.600'
            href={`/proposals/${params.proposalId}/sessions/${params.visitNumber}`}
          >
            return to the session samples dashboard
          </Link>{" "}
          for further editing before shipping your sample collection.
        </Text>
        {Object.keys(shipmentData.counts).length > 0 && (
          <>
            <Alert status='info' variant='info'>
              <AlertIcon />
              <AlertDescription>
                {shipmentData.isBooked
                  ? "The shipping process has already been started, contents may not be edited any further."
                  : "Once your shipment is booked with the courier service, you will not be able to edit the contents of the shipment any further."}
              </AlertDescription>
            </Alert>
            <VStack w='40%' border='1px solid' borderColor='diamond.300' p='1em'>
              <Heading alignSelf='start'>Contents</Heading>
              <DynamicFormView formType={shipmentData.formModel} data={shipmentData.counts} />
            </VStack>

            <ShippingInstructions params={params} isBooked={shipmentData.isBooked} />
          </>
        )}
      </VStack>
    </VStack>
  );
};

export default SubmissionOverview;
