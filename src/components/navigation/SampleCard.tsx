"use client";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client"
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
import { useCallback } from "react";
import NextLink from "next/link";

export interface SampleCardProps {
  sample: components["schemas"]["SampleOut"];
}

export const SampleCard = ({ sample }: SampleCardProps) => {
  const router = useRouter();
  const toast = useToast();

  const handleGridBoxClicked = useCallback(async () => {
    const resp = await authenticatedFetch.client(`/containers/${sample.containerId}`);

    if (resp?.status !== 200) {
      toast();
      return;
    }

    const container: components["schemas"]["ContainerOut"] = await resp.json();

    router.push(`./${container.shipmentId}/${container.type}/${container.id}/review`);
  }, [sample, router, toast]);

  console.log(sample);

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
            {sample.containerId && sample.parent ? (
              <StatHelpText m='0'>
                In <Link onClick={handleGridBoxClicked}>{sample.parent}</Link>{" "}
                {sample.location && `, slot ${sample.location}`}
              </StatHelpText>
            ) : (
              <StatHelpText m='0'>Not assigned to a container</StatHelpText>
            )}
          </VStack>
          <Button>View Data</Button>
          <Button as={NextLink} href={`./${sample.shipmentId}/${sample.type}/${sample.id}/review`}>
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
                href={`./${parent.shipmentId}/${parent.type}/${parent.id}/review`}
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
                href={`./${child.shipmentId}/${child.type}/${child.id}/review`}
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
