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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ShipmentParams } from "@/types/generic";
import { MdExpandMore, MdDatasetLinked, MdBlurCircular } from "react-icons/md";

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
        bg='gray.50'
        p='10px'
        border='1px solid #EDF2F7'
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
            <HStack>
              <Menu>
                <MenuButton>
                  <Button leftIcon={<MdDatasetLinked />} rightIcon={<MdExpandMore />}>
                    View Data
                  </Button>
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <NextLink
                      href={`${process.env.PATO_URL}/proposals/${params.proposalId}/sessions/${params.visitNumber}/groups/${sample.dataCollectionGroupId}/atlas`}
                    >
                      Atlas
                    </NextLink>
                  </MenuItem>
                  <MenuItem>
                    <NextLink
                      href={`${process.env.PATO_URL}/proposals/${params.proposalId}/sessions/${params.visitNumber}/groups/${sample.dataCollectionGroupId}`}
                    >
                      Data Collection
                    </NextLink>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )}
          <NextLink href={`${urlPrefix}${sample.shipmentId}/${sample.type}/${sample.id}/review`}>
            <Button leftIcon={<MdBlurCircular />}>View Grid</Button>
          </NextLink>
        </HStack>
      </Stat>

      <HStack w='100%' bg='purple' fontSize='14px' fontWeight='600' color='white' p='5px'>
        {Array.isArray(sample.originSamples) && sample.originSamples.length > 0 && (
          <HStack>
            <Text>Derived from </Text>
            {sample.originSamples.map((parent) => (
              <NextLink
                color='gray.300'
                key={parent.id}
                href={`${urlPrefix}${parent.shipmentId}/${parent.type}/${parent.id}/review`}
              >
                {parent.name}
              </NextLink>
            ))}
          </HStack>
        )}
        <Spacer />
        {Array.isArray(sample.derivedSamples) && sample.derivedSamples.length > 0 && (
          <HStack>
            <Text>Originated </Text>
            {sample.derivedSamples.map((child) => (
              <NextLink
                color='gray.300'
                key={child.id}
                href={`${urlPrefix}${child.shipmentId}/${child.type}/${child.id}/review`}
              >
                {child.name}
              </NextLink>
            ))}
          </HStack>
        )}
      </HStack>
    </Box>
  );
};
