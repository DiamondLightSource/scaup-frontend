"use client";
import {
  Button,
  Divider,
  Grid,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

export interface ProposalOverviewProps {
  proposalId: string;
  // TODO: use actual type
  data: Record<string, any> | null;
}

export const ProposalOverviewContent = ({ proposalId, data }: ProposalOverviewProps) => {
  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {proposalId}
        </Heading>
        <Heading>Proposal</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%'>
        <Text fontSize='18px' mt='2'>
          View existing shipments for this proposal, or add new shipments.
        </Text>
        <Heading mt='3' size='lg' color='grey.700'>
          Select Shipment
        </Heading>
      </VStack>
      <Divider borderColor='gray.800' />
      {data ? (
        <>
          <Grid templateColumns='repeat(5,1fr)' gap='4px' w='100%'>
            {data.map((shipment: any, i: number) => (
              <Link href={`${proposalId}/shipments/${shipment.itemId}`} key={i}>
                <Stat
                  key={i}
                  _hover={{
                    borderColor: "diamond.400",
                  }}
                  bg='diamond.50'
                  overflow='hidden'
                  p={2}
                  border='1px solid grey'
                  borderRadius={5}
                  w='100%'
                  cursor='pointer'
                >
                  <StatLabel>
                    <Tag colorScheme={shipment.isSubmitted ? "green" : "gray"}>
                      {shipment.isSubmitted ? "Submitted" : "Draft"}
                    </Tag>
                  </StatLabel>
                  <StatNumber>
                    <Text whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                      {shipment.shippingName ?? "No Name"}
                    </Text>
                  </StatNumber>
                  <StatHelpText mb='0'>
                    <b>Created: </b>
                    {shipment.creationDate ?? "?"}
                  </StatHelpText>
                </Stat>
              </Link>
            ))}
          </Grid>
        </>
      ) : (
        <Text fontWeight='600'>This proposal has no shipments assigned to it yet. You can:</Text>
      )}
      <Button as={Link} href={`${proposalId}/shipments/new`} bg='green.500'>
        Create new shipment
      </Button>
    </VStack>
  );
};
