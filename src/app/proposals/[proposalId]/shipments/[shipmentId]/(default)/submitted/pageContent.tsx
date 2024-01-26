"use client";

import { DynamicFormEntry } from "@/components/input/form/input";
import { DynamicFormView } from "@/components/visualisation/formView";
import { createShipmentRequest } from "@/utils/client";
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
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useCallback } from "react";

const SubmissionOverviewContent = ({
  data,
  params,
}: {
  data: { counts: Record<string, number>; formModel: DynamicFormEntry[]; isBooked: boolean };
  params: { shipmentId: string; proposalId: string };
}) => {
  const toast = useToast();

  const onShipmentCreateClicked = useCallback(async () => {
    try {
      await createShipmentRequest(params.shipmentId);
    } catch (e) {
      toast({ title: (e as Error).message, status: "error" });
    }
  }, [params, toast]);

  return (
    <VStack alignItems='start' mt='2em'>
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
            as={NextLink}
            href={`/proposals/${params.proposalId}/`}
          >
            return to the shipment list.
          </Link>
        </Text>
        <VStack w='40%' border='1px solid' borderColor='diamond.300' p='1em'>
          <Heading alignSelf='start'>Contents</Heading>
          <DynamicFormView formType={data.formModel} data={data.counts} />
        </VStack>
        <Alert status='info' variant='info'>
          <AlertIcon />
          <AlertDescription>
            {data.isBooked
              ? "The shipping process has already been started, contents may not be edited any further."
              : "Once your shipment is booked with the courier service, you will not be able to edit the contents of the shipment any further."}
          </AlertDescription>
        </Alert>
        {data.isBooked ? (
          <Button
            as={NextLink}
            href={`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/request`}
            bg='green.500'
          >
            View shipping information
          </Button>
        ) : (
          <Button onClick={onShipmentCreateClicked} bg='green.500'>
            Arrange shipping
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

export default SubmissionOverviewContent;
