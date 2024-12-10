"use client";

import { Cassette } from "@/components/containers/Cassette";
import { DynamicFormView } from "@/components/visualisation/formView";
import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { Divider, HStack, Heading, VStack, useToast, Button, Spacer, Link } from "@chakra-ui/react";
import { Table, TwoLineLink } from "@diamondlightsource/ui-components";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

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
  isStaff: boolean;
}

// TODO: make this more generic
// TODO: update logic for booking status check
const ShipmentHomeContent = ({ data, params, isStaff }: ShipmentHomeContentProps) => {
  const router = useRouter();

  const handleSampleClicked = useCallback(
    (item: Record<string, any>) => {
      // TODO: this should be more generic if this is not going to be eBIC only (the "grid" bit)
      router.push(`${params.shipmentId}/${item.type}/${item.id}/review`);
    },
    [router, params],
  );

  const samplesWithActions = useMemo(() => {
    const patoPrefix = `${process.env.PATO_URL}/proposals/${params.proposalId}/sessions/${params.visitNumber}/groups/`;
    return data.samples.map((sample) => ({
      ...sample,
      actions: sample.dataCollectionGroupId ? (
        <Button size='xs' as={Link} href={patoPrefix + sample.dataCollectionGroupId}>
          View Data
        </Button>
      ) : null,
    }));
  }, [data, params]);

  return (
    <HStack w='100%' mt='1em' alignItems='start' gap='3em'>
      <VStack alignItems='start' flex='1 0 0'>
        <HStack w='100%'>
          <Heading size='lg'>Samples</Heading>
          <Spacer />
          <Button as={NextLink} href={`${params.shipmentId}/import-samples`} size='sm'>
            Import Samples from Session
          </Button>
        </HStack>
        <Divider borderColor='gray.800' />
        <HStack w='100%' alignItems='start'>
          <Table
            flex='1 0 0'
            headers={[
              { key: "name", label: "name" },
              { key: "status", label: "status" },
              { key: "parent", label: "parent" },
              { key: "location", label: "location" },
              { key: "actions", label: "" },
            ]}
            data={samplesWithActions}
            onClick={handleSampleClicked}
          />
          {isStaff && data.samples && <Cassette samples={data.samples} />}
        </HStack>

        <Heading mt='1em' size='lg'>
          Pre-Session Information
        </Heading>
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
          title='Edit Sample Collection'
          as={NextLink}
          href={`${params.shipmentId}/edit`}
          isDisabled={data.dispatch.status === "Booked"}
        >
          Edit sample collection contents, or add new items
        </TwoLineLink>
        <TwoLineLink
          title={`${data.preSessionInfo ? "Edit" : "Set"} Pre-Session Information`}
          as={NextLink}
          href={`${params.shipmentId}/pre-session`}
          isDisabled={data.dispatch.status === "Booked" || data.hasUnassigned}
        >
          Set imaging conditions, grid/data acquisition parameters
        </TwoLineLink>
        <TwoLineLink
          title='Review Sample Collection'
          as={NextLink}
          href={`${params.shipmentId}/review`}
        >
          Review sample collection contents
        </TwoLineLink>
        <TwoLineLink title='Print Contents' as={NextLink} href={`${params.shipmentId}/print`}>
          View contents in a printable format
        </TwoLineLink>
        <TwoLineLink
          title='Print Pre-Session Information'
          as={NextLink}
          href={`${params.shipmentId}/print/pre-session`}
          isDisabled={!data.preSessionInfo}
        >
          View pre-session information in a printable format
        </TwoLineLink>
        <TwoLineLink
          title='Booking & Labels'
          as={NextLink}
          href={`${params.shipmentId}/booking-and-labels`}
          isDisabled={!data.counts.Dewar}
        >
          Book pickup with courier or print tracking labels
        </TwoLineLink>
        <TwoLineLink title='Request Return' href={`${params.shipmentId}/returns`}>
          Ask for dewars to be returned to your facility
        </TwoLineLink>
      </VStack>
    </HStack>
  );
};

export default ShipmentHomeContent;
