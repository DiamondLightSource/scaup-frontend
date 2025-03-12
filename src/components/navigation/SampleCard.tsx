"use client";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import {
  Box,
  Stat,
  HStack,
  VStack,
  StatLabel,
  Heading,
  Tag,
  StatHelpText,
  Button,
  Link,
  Text,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import NextLink from "next/link";
import { ShipmentParams } from "@/types/generic";
import { parseNetworkError } from "@/utils/generic";

export interface SampleCardProps {
  /** Sample to display */
  sample: components["schemas"]["SampleOut"];
  /** URL to PATo */
  patoUrl: string;
  /** Page params */
  params: ShipmentParams;
}

/**
 * A view that displays sample information and provides links to descendents, ancestors, collected data, and itself
 */
export const SampleCard = ({ sample, params, patoUrl }: SampleCardProps) => {
  const router = useRouter();
  const toast = useToast();

  const urlPrefix = useMemo(
    () => `/proposals/${params.proposalId}/sessions/${params.visitNumber}/shipments/`,
    [params],
  );

  const handleGridBoxClicked = useCallback(async () => {
    const resp = await authenticatedFetch.client(`/containers/${sample.containerId}`);

    if (resp?.status !== 200) {
      const jsonResponse = await resp?.json().catch(() => undefined);
      toast({
        status: "error",
        title: "Failed to get sample data",
        description: parseNetworkError(jsonResponse),
      });
      return;
    }

    const container: components["schemas"]["ContainerOut"] = await resp.json();

    router.push(`${urlPrefix}${container.shipmentId}/${container.type}/${container.id}/review`);
  }, [sample, router, toast, urlPrefix]);

  return (
    <Box w='100%' key={sample.id}>
      <Stat
        bg='gray.100'
        p='10px'
        border='1px solid black'
        borderBottom='none'
        borderRadius='0'
        m='0'
      >
        <HStack flexWrap='wrap'>
          <VStack alignItems='start' flex='1 0 0' minW='200px'>
            <StatLabel flexDirection='row' display='flex' gap='1em'>
              <Heading size='md'>{sample.name}</Heading>
              <Tag colorScheme={sample.dataCollectionGroupId ? "green" : "yellow"}>
                {sample.dataCollectionGroupId ? "Collected" : "Created"}
              </Tag>
            </StatLabel>
            {sample.containerId && sample.container ? (
              <StatHelpText m='0'>
                In <Link onClick={handleGridBoxClicked}>{sample.container}</Link>{" "}
                {sample.location && `, slot ${sample.location}`}
              </StatHelpText>
            ) : (
              <StatHelpText m='0'>Not assigned to a container</StatHelpText>
            )}
          </VStack>
          {sample.dataCollectionGroupId && (
            <Button
              as={NextLink}
              href={`${patoUrl}/proposals/${params.proposalId}/sessions/${params.visitNumber}/groups/${sample.dataCollectionGroupId}`}
            >
              View Data
            </Button>
          )}
          <Button
            as={NextLink}
            href={`${urlPrefix}${sample.shipmentId}/${sample.type}/${sample.id}/review`}
          >
            View Sample
          </Button>
        </HStack>
      </Stat>

      <HStack w='100%' bg='purple' fontSize='14px' fontWeight='600' color='white' p='5px'>
        {Array.isArray(sample.parents) && sample.parents.length > 0 && (
          <Text>
            Derived from{" "}
            {sample.parents.map((parent) => (
              <Link
                color='gray.300'
                key={parent.id}
                as={NextLink}
                href={`${urlPrefix}${parent.shipmentId}/${parent.type}/${parent.id}/review`}
              >
                {parent.name}
              </Link>
            ))}
          </Text>
        )}
        <Spacer />
        {Array.isArray(sample.children) && sample.children.length > 0 && (
          <Text>
            Originated{" "}
            {sample.children.map((child) => (
              <Link
                color='gray.300'
                key={child.id}
                as={NextLink}
                href={`${urlPrefix}${child.shipmentId}/${child.type}/${child.id}/review`}
              >
                {child.name}
              </Link>
            ))}
          </Text>
        )}
      </HStack>
    </Box>
  );
};
