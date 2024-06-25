import { DynamicFormEntry } from "@/components/input/form/input";
import { DynamicFormView } from "@/components/visualisation/formView";
import { authenticatedFetch } from "@/utils/client";
import { pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";
import ArrangeShipmentButton from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment Submitted - Sample Handling",
};

const getShipmentData = async (shipmentId: string) => {
  const res = await authenticatedFetch.server(`/shipments/${shipmentId}`);
  const data = res && res.status === 200 ? await res.json() : [];

  const counts = recursiveCountTypeInstances(data.children);
  const formModel: DynamicFormEntry[] = Object.keys(counts).map((key) => ({
    id: key,
    label: pascalToSpace(key),
    type: "text",
  }));

  return { counts, formModel, isBooked: !!(data && data.data.shipmentRequest) };
};

const SubmissionOverview = async ({
  params,
}: {
  params: { shipmentId: string; proposalId: string };
}) => {
  const shipmentData = await getShipmentData(params.shipmentId);

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <Heading>Shipment Overview</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%' gap='1em'>
        <Text fontSize='18px' my='1em'>
          Your shipment was <b>successfully submitted!</b> You may now arrange for your samples to
          be shipped to Diamond, or{" "}
          <Link
            textDecoration='underline'
            color='diamond.600'
            href={`/proposals/${params.proposalId}/`}
          >
            return to the shipment list.
          </Link>
        </Text>
        <VStack w='40%' border='1px solid' borderColor='diamond.300' p='1em'>
          <Heading alignSelf='start'>Contents</Heading>
          <DynamicFormView formType={shipmentData.formModel} data={shipmentData.counts} />
        </VStack>
        <Alert status='info' variant='info'>
          <AlertIcon />
          <AlertDescription>
            {shipmentData.isBooked
              ? "The shipping process has already been started, contents may not be edited any further."
              : "Once your shipment is booked with the courier service, you will not be able to edit the contents of the shipment any further."}
          </AlertDescription>
        </Alert>{" "}
        {shipmentData.isBooked ? (
          <Button
            as={NextLink}
            href={`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/request`}
            bg='green.500'
          >
            View shipping information
          </Button>
        ) : (
          <ArrangeShipmentButton params={params} />
        )}
      </VStack>
    </VStack>
  );
};

export default SubmissionOverview;
