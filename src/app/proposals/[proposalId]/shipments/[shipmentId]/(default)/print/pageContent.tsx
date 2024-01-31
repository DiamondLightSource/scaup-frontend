"use client";

import { DynamicFormView } from "@/components/visualisation/formView";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Link,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useCallback, useMemo } from "react";
import { MdLocalPrintshop } from "react-icons/md";

export interface PrintableOverviewContentProps {
  shipment: TreeData<BaseShipmentItem> | null;
  params: { shipmentId: string; proposalId: string };
  hasUnassigned: boolean;
}

interface ItemCardDisplayProps {
  item: TreeData<BaseShipmentItem>;
  level?: number;
  parent?: string | null;
}

const ItemCardDisplay = ({ item, level = 1, parent = null }: ItemCardDisplayProps) => {
  const locationText = useMemo(() => {
    if (!parent) {
      return null;
    }

    let text = `In ${parent}`;

    if (item.data.location) {
      text += `, position ${item.data.location}`;
    }
    return text;
  }, [parent, item]);

  return (
    <Box w='100%'>
      <Box w='100%' border='1px solid' borderColor='gray.400' mb='10px'>
        <HStack w='100%' bg='gray.200' p='1em'>
          <Heading size='md'>{item.name}</Heading>
          <Spacer />
          {locationText && <Text fontWeight='600'>{locationText}</Text>}
        </HStack>
        <Box p='1em'>
          <DynamicFormView data={item.data} formType={item.data.type} />
        </Box>
      </Box>
      <Box borderLeft='2px solid' w='100%' pl='10px' borderColor={`gray.${800 - level * 100}`}>
        {item.children
          ? item.children.map((child) => (
              <ItemCardDisplay key={child.id} item={child} level={level + 1} parent={item.name} />
            ))
          : null}
      </Box>
    </Box>
  );
};

const PrintableOverviewContent = ({
  shipment,
  params,
  hasUnassigned,
}: PrintableOverviewContentProps) => {
  const printPage = useCallback(() => window.print(), []);

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}
        </Heading>
        <HStack w='100%'>
          <Heading>Shipment Items</Heading>
          <Spacer />
          <Button leftIcon={<MdLocalPrintshop />} size='sm' onClick={printPage}>
            Print this page
          </Button>
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      {hasUnassigned && (
        <Alert status='info' variant='info'>
          <AlertIcon />
          <AlertDescription>
            This shipment contains unassigned items, which are not included in this listing.
          </AlertDescription>
        </Alert>
      )}
      {shipment !== null ? (
        <VStack alignItems='start' w='100%' gap='2em'>
          {shipment.children!.map((item) => (
            <ItemCardDisplay key={item.id} item={item} />
          ))}
        </VStack>
      ) : (
        <VStack mt='2em' alignItems='start'>
          <Heading size='lg'>No assigned items</Heading>
          <Text>
            This shipment contains <b>no assigned items</b>. You must{" "}
            <Link as={NextLink} href='edit'>
              add at least one item
            </Link>{" "}
            to this shipment to get a list of contents.
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

export default PrintableOverviewContent;
