"use client";

import { DynamicFormView } from "@/components/visualisation/formView";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createContext, useContext, useMemo } from "react";
import { MdLocalPrintshop } from "react-icons/md";

export interface PrintableOverviewContentProps {
  shipment: TreeData<BaseShipmentItem>;
  prepopData: Record<string, any>;
}

interface ItemCardDisplayProps {
  item: TreeData<BaseShipmentItem>;
  level?: number;
  parent?: string | null;
}

const PrepopContext = createContext<Record<string, any>>({});

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
  const prepopData = useContext(PrepopContext);
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
    <Accordion w='100%' allowMultiple defaultIndex={[0, 1, 2, 3, 4]}>
      <AccordionItem>
        <h2>
          <AccordionButton bg='gray.200'>
            <HStack w='100%'>
              <Heading size='md'>{item.name}</Heading>
              <Spacer />
              {locationText && <Text fontWeight='600'>{locationText}</Text>}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pr='0' pb='0'>
          <Box pb='1em'>
            <DynamicFormView data={item.data} formType={item.data.type} prepopData={prepopData} />
          </Box>
          {item.children
            ? item.children.map((child) => (
                <ItemCardDisplay key={child.id} item={child} level={level + 1} parent={item.name} />
              ))
            : null}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const PrintableOverviewContent = ({ shipment, prepopData }: PrintableOverviewContentProps) => (
  <PrepopContext.Provider value={prepopData}>
    <VStack alignItems='start' w='100%' gap='2em'>
      {shipment.children!.map((item) => (
        <ItemCardDisplay key={item.id} item={item} />
      ))}
    </VStack>
  </PrepopContext.Provider>
);

export default PrintableOverviewContent;
