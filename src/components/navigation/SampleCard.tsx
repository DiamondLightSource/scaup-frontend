import { components } from "@/types/schema";
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
  Spacer,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ShipmentParams } from "@/types/generic";

export interface SampleCardProps {
  /** Sample to display */
  sample: components["schemas"]["SampleOut"];
  /** Page params */
  params: ShipmentParams;
}

/**
 * A view that displays sample information and provides links to descendents, ancestors, collected data, and itself.
 *
 * This is a server-rendered component.
 */
export const SampleCard = ({ sample, params }: SampleCardProps) => {
  const urlPrefix = `/proposals/${params.proposalId}/sessions/${params.visitNumber}/shipments/`;

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
            <StatLabel flexDirection='row' display='flex' gap='1em' flexWrap='wrap'>
              <Heading
                size='md'
                textOverflow='ellipsis'
                overflow='hidden'
                whiteSpace='nowrap'
                maxW='15vw'
              >
                {sample.name}
              </Heading>
              <Tag colorScheme={sample.dataCollectionGroupId ? "green" : "yellow"}>
                {sample.dataCollectionGroupId ? "Collected" : "Created"}
              </Tag>
            </StatLabel>
            {sample.containerId && sample.containerName ? (
              <StatHelpText m='0'>
                In <Link href={`/containers/${sample.containerId}`}>{sample.containerName}</Link>{" "}
                {sample.location && `, slot ${sample.location}`}
              </StatHelpText>
            ) : (
              <StatHelpText m='0'>Not assigned to a container</StatHelpText>
            )}
          </VStack>
          {sample.dataCollectionGroupId && (
            <Button
              as={NextLink}
              href={`${process.env.PATO_URL}/proposals/${params.proposalId}/sessions/${params.visitNumber}/groups/${sample.dataCollectionGroupId}`}
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
        {Array.isArray(sample.originSamples) && sample.originSamples.length > 0 && (
          <HStack>
            <Text>Derived from </Text>
            {sample.originSamples.map((parent) => (
              <Link
                color='gray.300'
                key={parent.id}
                as={NextLink}
                href={`${urlPrefix}${parent.shipmentId}/${parent.type}/${parent.id}/review`}
              >
                {parent.name}
              </Link>
            ))}
          </HStack>
        )}
        <Spacer />
        {Array.isArray(sample.derivedSamples) && sample.derivedSamples.length > 0 && (
          <HStack>
            <Text>Originated </Text>
            {sample.derivedSamples.map((child) => (
              <Link
                color='gray.300'
                key={child.id}
                as={NextLink}
                href={`${urlPrefix}${child.shipmentId}/${child.type}/${child.id}/review`}
              >
                {child.name}
              </Link>
            ))}
          </HStack>
        )}
      </HStack>
    </Box>
  );
};
