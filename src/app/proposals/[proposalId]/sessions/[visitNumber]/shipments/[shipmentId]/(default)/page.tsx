import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { getShipmentData } from "@/utils/client/shipment";
import { allItemsEmptyInDict, pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import {
  Button,
  Divider,
  HStack,
  Heading,
  Link,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/mappings/authOptions";
import NextLink from "next/link";
import { TwoLineLink } from "@diamondlightsource/ui-components";
import { Cassette } from "@/components/containers/Cassette";
import { DynamicFormView } from "@/components/visualisation/formView";
import { SampleCard } from "@/components/navigation/SampleCard";

export const metadata: Metadata = {
  title: "Sample Collection - Scaup",
};

const getShipmentAndSampleData = async (shipmentId: string) => {
  const data = await getShipmentData(shipmentId);
  const resSamples = await authenticatedFetch.server(
    `/shipments/${shipmentId}/samples?ignoreExternal=false`,
    {
      cache: "force-cache",
      next: { tags: ["samples", "shipment"] },
    },
  );

  const resPreSession = await authenticatedFetch.server(`/shipments/${shipmentId}/preSession`);
  const unassignedData = (await getShipmentData(shipmentId, "/unassigned")) as Record<string, any>;

  const hasUnassigned = allItemsEmptyInDict(unassignedData);

  if (data === null) {
    return data;
  }

  let counts: Record<string, number> = {};

  for (const [key, value] of Object.entries(recursiveCountTypeInstances(data.children))) {
    counts[pascalToSpace(key)] = value;
  }

  let samples: components["schemas"]["SampleOut"][] = [];
  if (resSamples.status === 200) {
    samples = (await resSamples.json()).items;
  }

  let preSessionInfo: Record<string, any> | null = null;
  if (resPreSession.status === 200) {
    preSessionInfo = await resPreSession.json();
  }

  return { counts, samples, dispatch: data.data, name: data.name, preSessionInfo, hasUnassigned };
};

const ShipmentHome = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const shipmentData = await getShipmentAndSampleData(params.shipmentId);
  const session = await getServerSession(authOptions);
  const isStaff = !!session && session.permissions.includes("em_admin");

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          Sample Collection
        </Heading>
        <Heading>{shipmentData ? shipmentData.name : "Shipment"}</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      {shipmentData === null ? (
        <VStack w='100%' mt='3em'>
          <Heading variant='notFound'>Sample Collection Unavailable</Heading>
          <Text>
            This sample collection does not exist or you do not have permission to view it.
          </Text>
          <Link as={NextLink} href='..'>
            Return to session page
          </Link>
        </VStack>
      ) : (
        <>
          <HStack w='100%' mb='1em'>
            <Stat borderBottom='3px solid' borderColor='diamond.700'>
              <StatLabel>Status</StatLabel>
              <StatNumber>{shipmentData.dispatch.status || "Unknown"}</StatNumber>
            </Stat>
            {Object.entries(shipmentData.counts).map(([key, value]) => (
              <Stat borderBottom='3px solid' borderColor='diamond.700' key={key}>
                <StatLabel>{key}</StatLabel>
                <StatNumber>{value}</StatNumber>
              </Stat>
            ))}
          </HStack>
          <HStack w='100%' mt='1em' alignItems='start' gap='3em' flexWrap='wrap'>
            <VStack alignItems='start' flex='1 0 0'>
              <HStack w='100%'>
                <Heading size='lg'>Samples</Heading>
                <Spacer />
                <Button as={NextLink} href={`${params.shipmentId}/import-samples`} size='sm'>
                  Import Samples from Session
                </Button>
              </HStack>
              <Divider borderColor='gray.800' />
              <HStack w='100%' alignItems='start' flexWrap='wrap'>
                <VStack w='75%' my='20px' flex='1 0 0' h='22em' overflowY='scroll'>
                  {shipmentData.samples.map((sample) => (
                    <SampleCard key={sample.id} sample={sample} params={params} />
                  ))}
                </VStack>
                {isStaff && shipmentData.samples && <Cassette samples={shipmentData.samples} />}
              </HStack>

              <Heading mt='1em' size='lg'>
                Pre-Session Information
              </Heading>
              <Divider borderColor='gray.800' />
              {shipmentData.preSessionInfo ? (
                <DynamicFormView
                  formType='preSession'
                  data={shipmentData.preSessionInfo.details}
                  prepopData={shipmentData.preSessionInfo.details}
                />
              ) : (
                <Heading py={10} w='100%' variant='notFound'>
                  No pre-session information found
                </Heading>
              )}
            </VStack>
            <VStack alignItems='start' minW='200px'>
              <Heading size='lg'>Actions</Heading>
              <TwoLineLink
                title='Edit Sample Collection'
                as={NextLink}
                href={`${params.shipmentId}/edit`}
                isDisabled={shipmentData.dispatch.status === "Booked"}
              >
                Edit sample collection contents, or add new items
              </TwoLineLink>
              <TwoLineLink
                title={`${shipmentData.preSessionInfo ? "Edit" : "Set"} Pre-Session Information`}
                as={NextLink}
                href={`${params.shipmentId}/pre-session`}
                isDisabled={shipmentData.dispatch.status === "Booked" || shipmentData.hasUnassigned}
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
                View contents in a printable tree format
              </TwoLineLink>
              <TwoLineLink
                title='Print Contents as Tables'
                href={`${process.env.SERVER_API_URL}/shipments/${params.shipmentId}/pdf-report`}
              >
                View contents in a printable tabled format
              </TwoLineLink>
              <TwoLineLink
                title='Print Pre-Session Information'
                as={NextLink}
                href={`${params.shipmentId}/print/pre-session`}
                isDisabled={!shipmentData.preSessionInfo}
                data-testid='pre-session-label'
              >
                View pre-session information in a printable format
              </TwoLineLink>
              <TwoLineLink
                title='Booking & Labels'
                as={NextLink}
                href={`${params.shipmentId}/booking-and-labels`}
                isDisabled={!shipmentData.counts.Dewar}
                data-testid='booking-label'
              >
                Book pickup with courier or print tracking labels
              </TwoLineLink>
              <TwoLineLink title='Request Return' href={`${params.shipmentId}/returns`}>
                Ask for dewars to be returned to your facility
              </TwoLineLink>
            </VStack>
          </HStack>
        </>
      )}
    </VStack>
  );
};

export default ShipmentHome;
