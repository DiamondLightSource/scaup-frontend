"use client";
import { DynamicForm, formMapping } from "@/components/input/form";
import { ShipmentParams } from "@/types/generic";
import { authenticatedFetch } from "@/utils/client";
import { Box, Button, HStack, Spacer, VStack, useToast } from "@chakra-ui/react";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export const metadata: Metadata = {
  title: "Pre-Session Information - Sample Handling",
};

const PreSessionContent = ({
  params,
  prepopData,
}: {
  params: ShipmentParams;
  prepopData: Record<string, any> | null;
}) => {
  const formContext = useForm({ values: prepopData ?? {} });
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = formContext.handleSubmit(async (info) => {
    setIsLoading(true);
    const response = await authenticatedFetch.client(`/shipments/${params.shipmentId}/push`, {
      method: "POST",
    });

    const preSessionResponse = await authenticatedFetch.client(
      `/shipments/${params.shipmentId}/preSession`,
      {
        method: "PUT",
        body: JSON.stringify({ details: info }),
      },
    );
    setIsLoading(false);

    if (
      preSessionResponse &&
      response &&
      response.status === 200 &&
      preSessionResponse.status === 201
    ) {
      router.push("submitted");
    } else {
      toast({ description: "Could not update items! Please try again later", status: "error" });
    }
  });

  return (
    <VStack alignItems='start' h='100%' w='100%' py='3'>
      <FormProvider {...formContext}>
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
          <Box py='3' w={{ lg: "50%", base: "100%" }}>
            <DynamicForm formType={formMapping["preSession"]} />
          </Box>
          <HStack h='3.5em' px='1em' bg='gray.200'>
            <Spacer />
            <Button onClick={() => router.back()}>Back</Button>
            <Button bg='green.500' type='submit' isLoading={isLoading}>
              Finish
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

export default PreSessionContent;
