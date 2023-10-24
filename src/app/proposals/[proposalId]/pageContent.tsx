"use client";
import { Item } from "@/utils/client/item";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface ProposalOverviewProps {
  proposalId: string;
  // TODO: use actual type
  data: Record<string, any> | null;
}

export const ProposalOverviewContent = ({ proposalId, data }: ProposalOverviewProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleNewShipment = useCallback(async () => {
    const newShipment = await Item.create(
      session,
      proposalId,
      { name: "New Shipment" },
      "shipments",
    );
    router.push(`/proposals/${proposalId}/shipments/${newShipment.id}`);
  }, [session, proposalId, router]);

  return (
    <VStack alignItems='start' mt='1em'>
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
              <Link href={`${proposalId}/shipments/${shipment.id}`} key={i}>
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
                      {shipment.name ?? "No Name"}
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
          <Heading size='md' borderLeft='3px solid' p='0.5em' my='0.5em' borderColor='diamond.800'>
            or
          </Heading>
        </>
      ) : (
        <Text fontWeight='600'>This proposal has no shipments assigned to it yet. You can:</Text>
      )}
      <Button onClick={handleNewShipment} bg='green.500'>
        Create new shipment
      </Button>
    </VStack>
  );
};
