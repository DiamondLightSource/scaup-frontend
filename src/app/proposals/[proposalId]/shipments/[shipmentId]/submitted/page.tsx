"use client";

import { Button, Divider, HStack, Heading, Link, Text, VStack } from "@chakra-ui/react";

const SubmissionOverview = ({
  params,
}: {
  params: { proposalId: string; submittedId: string };
}) => {
  return (
    <VStack alignItems='start' mt='1em'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <Heading>Shipment Submitted</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%'>
        <Text fontSize='18px' mt='2'>
          Your shipment was <b>successfully submitted!</b> You may now arrange for your samples to
          be shipped to Diamond, or return to the shipment list.
        </Text>
        <HStack>
          <Button>Arrange shipping</Button>
          <Link>Return to shipment list</Link>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default SubmissionOverview;
