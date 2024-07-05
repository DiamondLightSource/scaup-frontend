"use client";

import { DynamicFormView } from "@/components/visualisation/formView";
import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { createShipmentRequest } from "@/utils/client";
import { Divider, HStack, Heading, VStack, useToast } from "@chakra-ui/react";
import { Table, TwoLineLink } from "@diamondlightsource/ui-components";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface ShipmentHomeData {
  counts: Record<string, number>;
  samples: components["schemas"]["SampleOut"][];
  dispatch: Record<string, number | string>;
  name: string;
  preSessionInfo: Record<string, any> | null;
  hasUnassigned: boolean;
}

export interface ShipmentHomeContentProps {
  data: ShipmentHomeData;
  params: ShipmentParams;
}

// TODO: make this more generic
// TODO: update logic for booking status check
const ShipmentHomeContent = ({ data, params }: ShipmentHomeContentProps) => {
  const toast = useToast();
  const router = useRouter();

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

  const handleSampleClicked = useCallback(
    (item: Record<string, any>) => {
      // TODO: this should be more generic if this is not going to be eBIC only (the "grid" bit)
      router.push(`${params.shipmentId}/${item.type}/${item.id}/review`);
    },
    [router, params],
  );

  return (
    <HStack w='100%' mt='1em' alignItems='start' gap='3em'>
      <VStack alignItems='start' flex='1 0 0'>
        <Heading size='lg'>Samples</Heading>
        <Divider borderColor='gray.800' />
        <Table
          w='100%'
          headers={[
            { key: "name", label: "name" },
            { key: "status", label: "status" },
            { key: "actions", label: "" },
            { key: "parent", label: "parent" },
            { key: "location", label: "location" },
          ]}
          data={data.samples}
          onClick={handleSampleClicked}
        />
        <Heading size='lg'>Pre-Session Information</Heading>
        <Divider borderColor='gray.800' />
        {data.preSessionInfo ? (
          <DynamicFormView
            formType='preSession'
            data={data.preSessionInfo.details}
            prepopData={data.preSessionInfo.details}
          />
        ) : (
          <Heading py={10} w='100%' variant='notFound'>
            No pre-session information found
          </Heading>
        )}
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
        <TwoLineLink
          title='Edit Pre-Session Information'
          as={NextLink}
          href={`${params.shipmentId}/pre-session`}
          isDisabled={data.dispatch.status === "Booked" || data.hasUnassigned}
        >
          Edit imaging conditions, grid/data acquisition parameters
        </TwoLineLink>
        <TwoLineLink title='Review Shipment' as={NextLink} href={`${params.shipmentId}/review`}>
          Review shipment contents
        </TwoLineLink>
        <TwoLineLink title='Print Contents' as={NextLink} href={`${params.shipmentId}/print`}>
          View shippable contents in a printable format
        </TwoLineLink>
        <TwoLineLink
          title='Print Pre-Session Information'
          as={NextLink}
          href={`${params.shipmentId}/print/pre-session`}
        >
          View pre-session information in a printable format
        </TwoLineLink>
        <TwoLineLink
          title={`${data.dispatch.status === "Booked" ? "Edit" : "Create"} Booking`}
          onClick={handleBookingClicked}
        >
          Book pickup with courier
        </TwoLineLink>
        <TwoLineLink title='Request Return' href={`${params.shipmentId}/returns`}>
          Ask for dewars to be returned to your facility
        </TwoLineLink>
      </VStack>
    </HStack>
  );
};

export default ShipmentHomeContent;
