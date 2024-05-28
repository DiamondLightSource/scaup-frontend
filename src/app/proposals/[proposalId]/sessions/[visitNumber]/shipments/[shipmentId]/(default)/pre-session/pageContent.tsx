"use client";
import { DynamicForm } from "@/components/input/form";
import { Box, Button, HStack, Spacer, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export const metadata: Metadata = {
  title: "Pre-Session Information - Sample Handling",
};

const PreSessionContent = () => {
  const formContext = useForm();
  const router = useRouter();
  const onSubmit = formContext.handleSubmit(async (info) => {
    router.push("submitted");
  });

  return (
    <VStack alignItems='start' h='100%' w='100%' py='3'>
      <FormProvider {...formContext}>
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
          <Box py='3' w={{ lg: "50%", base: "100%" }}>
            <DynamicForm formType='preSession' />
          </Box>
          <HStack h='3.5em' px='1em' bg='gray.200'>
            <Spacer />
            <Button as={NextLink} href='-1' type='submit'>
              Back
            </Button>
            <Button bg='green.500' type='submit'>
              Finish
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

export default PreSessionContent;
