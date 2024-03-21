"use client";

import { DynamicFormView } from "@/components/visualisation/formView";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { Box, Button, HStack, Heading, Spacer, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { MdLocalPrintshop } from "react-icons/md";

export interface PrintableOverviewContentProps {
  shipment: TreeData<BaseShipmentItem>;
}

interface ItemCardDisplayProps {
  item: TreeData<BaseShipmentItem>;
  level?: number;
  parent?: string | null;
}

export const PrintButton = () => (
  <Button
    leftIcon={<MdLocalPrintshop />}
    size='sm'
    onClick={() => {
      if (typeof window !== undefined) {
        window.print();
      }
    }}
  >
    Print this page
  </Button>
);

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

const PrintableOverviewContent = ({ shipment }: PrintableOverviewContentProps) => (
  <VStack alignItems='start' w='100%' gap='2em'>
    {shipment.children!.map((item) => (
      <ItemCardDisplay key={item.id} item={item} />
    ))}
  </VStack>
);

export default PrintableOverviewContent;
