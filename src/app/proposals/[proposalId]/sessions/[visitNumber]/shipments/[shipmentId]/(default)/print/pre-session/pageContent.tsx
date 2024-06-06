"use client";
import { DynamicFormView } from "@/components/visualisation/formView";
import { VStack } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipment - Sample Handling",
};

const PreSessionPrintContent = ({ data }: { data: Record<string, any> }) => {
  return (
    <VStack alignItems='start' w='100%'>
      <DynamicFormView formType='preSession' data={data} prepopData={data} />
    </VStack>
  );
};

export default PreSessionPrintContent;
