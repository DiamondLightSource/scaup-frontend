"use client";

import {
  Divider,
  HStack,
  Heading,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Table } from "@diamondlightsource/ui-components";
import NextLink from "next/link";
import { MdArrowForwardIos } from "react-icons/md";

export interface ShipmentHomeData {
  counts: Record<string, number>;
  // TODO: type this properly
  samples: any[];
  // TODO: type this properly
  dispatch: Record<string, any>;
}

interface LinkCardProps {
  children: string;
  title: string;
  href: string;
}

const LinkCard = ({ children, title, href }: LinkCardProps) => (
  <VStack w='100%' alignItems='start' as={NextLink} href={href} _hover={{ bg: "diamond.100" }}>
    <HStack w='100%' gap='2em'>
      <VStack alignItems='start' flex='1 0 0'>
        <Text color='diamond.600' fontWeight='600'>
          {title}
        </Text>
        <Text>{children}</Text>
      </VStack>
      <Icon color='diamond.600' as={MdArrowForwardIos} />
    </HStack>
    <Divider />
  </VStack>
);

export interface ShipmentHomeContentProps {
  data: ShipmentHomeData; // TODO: type this with server's types
  params: { shipmentId: string; proposalId: string };
}

// TODO: make this more generic
// TODO: update logic for booking status check
const ShipmentHomeContent = ({ data, params }: ShipmentHomeContentProps) => {
  return (
    <VStack alignItems='start' mt='2em'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          Shipment
        </Heading>
        <Heading>Shipment Name Here</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <HStack w='100%' mb='1em'>
        <Stat borderBottom='3px solid' borderColor='diamond.700'>
          <StatLabel>Status</StatLabel>
          <StatNumber>{data.dispatch.status}</StatNumber>
        </Stat>
        {Object.entries(data.counts).map(([key, value]) => (
          <Stat borderBottom='3px solid' borderColor='diamond.700' key={key}>
            <StatLabel>{key}</StatLabel>
            <StatNumber>{value}</StatNumber>
          </Stat>
        ))}
      </HStack>
      <HStack w='100%' mt='1em' alignItems='start' gap='3em'>
        <VStack alignItems='start' flex='1 0 0'>
          <Heading size='lg'>Samples</Heading>
          <Table
            w='100%'
            headers={[
              { key: "name", label: "name" },
              { key: "macromolecule", label: "macromolecule" },
              { key: "status", label: "status" },
              { key: "actions", label: "" },
            ]}
            data={data.samples}
          />
        </VStack>

        <VStack alignItems='start'>
          <Heading size='lg'>Actions</Heading>
          {data.dispatch.status !== "Booked" && (
            <LinkCard title='Edit Shipment' href={`${params.shipmentId}/edit`}>
              Edit shipment contents, or add new items
            </LinkCard>
          )}
          <LinkCard title='Review Shipment' href={`${params.shipmentId}/review`}>
            Review shipment contents
          </LinkCard>
          <LinkCard
            title={`${data.dispatch.status === "Booked" ? "Edit" : "Create"} Booking`}
            href={"review"}
          >
            Book pickup with courier
          </LinkCard>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ShipmentHomeContent;
