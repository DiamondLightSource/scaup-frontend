"use client";
import { DynamicForm } from "@/components/input/form";
import { DynamicFormEntry } from "@/types/forms";
import { SessionParams } from "@/types/generic";
import { CreationResponse } from "@/types/server";
import { Item } from "@/utils/client/item";
import { Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface ShipmentData {
  name: string;
  importSamples: boolean;
}

const shipmentForm = [
  { id: "name", label: "Name", type: "text", validation: { required: "Required" } },
  {
    id: "importSamples",
    label: "Use Existing Samples",
    hint: "Use samples from an existing shipment, which are already stored in the facility",
    type: "checkbox",
  },
] as DynamicFormEntry[];

export const ShipmentCreationForm = ({ proposalId, visitNumber }: SessionParams) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formContext = useForm<ShipmentData>();

  const onSubmit = formContext.handleSubmit(async (info: ShipmentData) => {
    try {
      setIsLoading(true);
      const newShipment = (await Item.createShipment(proposalId, visitNumber, {
        name: info.name,
      })) as CreationResponse;

      router.push(
        `${visitNumber}/shipments/${newShipment.id}/${info.importSamples ? "import-samples?new=true" : "edit"}`,
      );
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <FormProvider {...formContext}>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "20em",
          flex: "1 0 auto",
        }}
      >
        <Heading mt='3' mb='0.5em' size='lg' color='grey.700'>
          Create New Shipment
        </Heading>
        <DynamicForm formType={shipmentForm} />
        <Button w='150px' mt='1em' type='submit' bg='green.500' isLoading={isLoading}>
          Create
        </Button>
      </form>
    </FormProvider>
  );
};
