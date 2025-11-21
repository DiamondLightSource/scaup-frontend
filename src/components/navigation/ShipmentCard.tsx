import { components } from "@/types/schema";
import {
  Box,
  Stat,
  HStack,
  VStack,
  StatLabel,
  Heading,
  Tag,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { getShipmentStatus } from "@/mappings/colours";
import { formatDate } from "@/utils/generic";

export interface ShipmentCardProps {
  /** Sample collection to display */
  shipment: components["schemas"]["ShipmentOut"];
}

/**
 * A view that displays sample information and provides links to descendents, ancestors, collected data, and itself.
 *
 * This is a server-rendered component.
 */
export const ShipmentCard = ({ shipment }: ShipmentCardProps) => {
  const urlPrefix = `/proposals/`;

  return (
    <Box w='100%' key={shipment.id} border='1px solid #EDF2F7'>
      <Stat bg='gray.50' p='10px' m='0'>
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
                {shipment.name}
              </Heading>
              <Tag colorScheme={getShipmentStatus(shipment).colour}>
                {getShipmentStatus(shipment).statusText}
              </Tag>
            </StatLabel>
          </VStack>
          <Button
            as={NextLink}
            href={`${urlPrefix}${shipment.proposalCode}${shipment.proposalNumber}/sessions/${shipment.visitNumber}/shipments/${shipment.id}`}
          >
            View Sample Collection
          </Button>
        </HStack>
      </Stat>
      <HStack
        w='100%'
        bg='gray.100'
        fontSize='14px'
        fontWeight='600'
        p='5px'
        justifyContent='space-between'
      >
        <Text>
          Session:{" "}
          <Link as={NextLink} href={`sessions/${shipment.visitNumber}/shipments`}>
            {shipment.visitNumber}
          </Link>
        </Text>
        <Text>
          Creation Date: {shipment.creationDate ? formatDate(shipment.creationDate) : "?"}
        </Text>
      </HStack>
    </Box>
  );
};
