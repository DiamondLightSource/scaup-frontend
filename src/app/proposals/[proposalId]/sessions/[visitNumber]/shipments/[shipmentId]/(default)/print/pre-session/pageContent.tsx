"use client";
import { DynamicFormView } from "@/components/visualisation/formView";
import { Heading, VStack } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipment - Sample Handling",
};

const PreSessionPrintContent = ({ data }: { data: Record<string, any> | null }) => {
  return (
    <VStack alignItems='start' w='100%'>
      {data ? (
        <DynamicFormView formType='preSession' data={data} prepopData={data} />
      ) : (
        <Heading w='100%' py='1em' variant='notFound'>
          No pre-session information available
        </Heading>
      )}
    </VStack>
  );
};

export default PreSessionPrintContent;
