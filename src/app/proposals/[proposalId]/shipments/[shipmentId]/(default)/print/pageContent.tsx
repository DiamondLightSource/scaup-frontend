"use client";

import { DynamicFormView } from "@/components/visualisation/formView";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { pascalToSpace } from "@/utils/generic";
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
import { useCallback } from "react";
import { MdLocalPrintshop } from "react-icons/md";

export interface PrintableOverviewContentProps {
  data: Record<string, TreeData<BaseShipmentItem>[]> | null;
  params: { shipmentId: string; proposalId: string };
  hasUnassigned: boolean;
}

const PrintableOverviewContent = ({
  data,
  params,
  hasUnassigned,
}: PrintableOverviewContentProps) => {
  const printPage = useCallback(() => window.print(), []);

  return (
    <VStack alignItems='start' mt='2em'>
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
      {data !== null ? (
        <VStack alignItems='start' w='100%'>
          {Object.entries(data).map(([key, itemArray]) => (
            <VStack key={key} w='100%' alignItems='start'>
              <Heading mt='0.5em'>{pascalToSpace(key)}</Heading>
              <Divider borderColor='grey.600' />
              {itemArray.map((item, i) => (
                <Box key={`${item.id}-${i}`} w='100%' border='1px solid' borderColor='gray.400'>
                  <HStack w='100%' bg='gray.200' p='1em'>
                    <Heading size='md'>{item.name}</Heading>
                    <Spacer />
                    <Text>In {item.data.parent}</Text>
                  </HStack>
                  <Box p='1em'>
                    <DynamicFormView data={item.data} formType={item.data.type} />
                  </Box>
                </Box>
              ))}
            </VStack>
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
