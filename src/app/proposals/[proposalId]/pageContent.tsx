"use client";
import { DynamicForm } from "@/components/input/form";
import { DynamicFormEntry } from "@/components/input/form/input";
import { Item } from "@/utils/client/item";
import { Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export interface ProposalOverviewProps {
  proposalId: string;
}

interface ShipmentData {
  name: string;
}

const shipmentForm = [
  { id: "name", label: "Name", type: "text", validation: { required: "Required" } },
] as DynamicFormEntry[];

export const ShipmentCreationForm = ({ proposalId }: ProposalOverviewProps) => {
  const router = useRouter();
  const formContext = useForm<ShipmentData>();

  const onSubmit = formContext.handleSubmit(async (info: ShipmentData) => {
    const newShipment = await Item.create(proposalId, { name: info.name }, "shipments");

    router.push(`/proposals/${proposalId}/shipments/${newShipment.id}/edit`);
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
        <Button w='150px' mt='1em' type='submit' bg='green.500'>
          Create
        </Button>
      </form>
    </FormProvider>
  );
};
