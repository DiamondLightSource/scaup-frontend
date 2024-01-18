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
} from "@chakra-ui/react";
import NextLink from "next/link";

const SubmissionOverviewContent = ({
  data,
  params,
}: {
  data: { counts: Record<string, number>; formModel: DynamicFormEntry[] };
  params: { shipmentId: string; proposalId: string };
}) => {
  return (
    <VStack alignItems='start' mt='2em'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <Heading>Shipment Submitted</Heading>
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
            Once your shipment is booked with the courier service, you will not be able to edit the
            contents of the shipment any further.
          </AlertDescription>
        </Alert>
        <Button onClick={() => createShipmentRequest(params.shipmentId)} bg='green.500'>
          Arrange shipping
        </Button>
      </VStack>
    </VStack>
  );
};

export default SubmissionOverviewContent;
