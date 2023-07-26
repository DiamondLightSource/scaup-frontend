"use client";
import { Button, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

const ProposalOverview = ({ params }: { params: { proposalId: string } }) => {
  return (
    <VStack alignItems='start'>
      <Heading size='md' color='gray.600'>
        {params.proposalId}
      </Heading>
      <Heading>Proposal</Heading>
      <Divider borderColor='gray.800' />
      <VStack alignItems='start' mt='10px' gap='3'>
        <Text fontWeight='600'>This proposal has no shipments assigned to it yet. You can:</Text>
        <Button as={Link} href={`${params.proposalId}/shipments/new`} bg='green.500'>
          Create new shipment
        </Button>
      </VStack>
    </VStack>
  );
};

export default ProposalOverview;
