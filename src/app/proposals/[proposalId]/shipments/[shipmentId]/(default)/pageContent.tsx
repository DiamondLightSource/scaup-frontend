"use client";

import { components } from "@/types/schema";
import { createShipmentRequest } from "@/utils/client";
import {
  Divider,
  HStack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Table, TwoLineLink } from "@diamondlightsource/ui-components";
import NextLink from "next/link";
import { useCallback } from "react";

export interface ShipmentHomeData {
  counts: Record<string, number>;
  samples: components["schemas"]["GenericItem"][];
  dispatch: Record<string, number | string>;
  name: string;
}

export interface ShipmentHomeContentProps {
  data: ShipmentHomeData;
  params: { shipmentId: string; proposalId: string };
}

// TODO: make this more generic
// TODO: update logic for booking status check
const ShipmentHomeContent = ({ data, params }: ShipmentHomeContentProps) => {
  const toast = useToast();
  const handleBookingClicked = useCallback(async () => {
    if (data.dispatch.status === "Booked") {
      window.location.assign(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/request`,
      );
    } else {
      try {
        await createShipmentRequest(params.shipmentId);
      } catch (e) {
        toast({ title: (e as Error).message, status: "error" });
      }
    }
  }, [params, data, toast]);

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          Shipment
        </Heading>
        <Heading>{data.name}</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <HStack w='100%' mb='1em'>
        <Stat borderBottom='3px solid' borderColor='diamond.700'>
          <StatLabel>Status</StatLabel>
          <StatNumber>{data.dispatch.status || "Unknown"}</StatNumber>
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
          <TwoLineLink
            title='Edit Shipment'
            as={NextLink}
            href={`${params.shipmentId}/edit`}
            isDisabled={data.dispatch.status === "Booked"}
          >
            Edit shipment contents, or add new items
          </TwoLineLink>
          <TwoLineLink title='Review Shipment' as={NextLink} href={`${params.shipmentId}/review`}>
            Review shipment contents
          </TwoLineLink>
          <TwoLineLink title='Print' as={NextLink} href={`${params.shipmentId}/print`}>
            View shippable contents in a printable format
          </TwoLineLink>
          <TwoLineLink
            title={`${data.dispatch.status === "Booked" ? "Edit" : "Create"} Booking`}
            onClick={handleBookingClicked}
          >
            Book pickup with courier
          </TwoLineLink>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ShipmentHomeContent;
