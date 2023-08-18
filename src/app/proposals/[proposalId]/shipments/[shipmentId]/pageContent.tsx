"use client";
import { GridBox } from "@/components/containers/gridBox";
import { DynamicForm } from "@/components/input/form";
import { TreeData } from "@/components/visualisation/treeView";
import {
  addRootItem,
  addUnassigned,
  saveActiveItem,
  selectActiveItem,
  selectIsEdit,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, checkIsRoot, getCurrentStepIndex, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { authenticatedFetch } from "@/utils/client";
import { Button, Divider, HStack, Heading, Spacer, VStack, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface ItemFormPageContentProps {
  // TODO: use actual type
  prepopData: Record<string, any>;
  shipmentId: string;
}

const ItemFormPageContent = ({ prepopData, shipmentId }: ItemFormPageContentProps) => {
  const { data: session } = useSession();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(() => steps[getCurrentStepIndex(activeItem.data.type)], [activeItem]);

  const activeIsEdit = useSelector(selectIsEdit);
  const formContext = useForm<BaseShipmentItem>({ defaultValues: activeItem.data });

  useEffect(() => {
    formContext.reset(activeItem.data, { keepValues: false, keepDefaultValues: true });
  }, [formContext, activeItem, activeIsEdit]);

  const onSubmit = formContext.handleSubmit(async (info: Omit<BaseShipmentItem, "type">) => {
    if (!activeIsEdit) {
      const values: TreeData<BaseShipmentItem> = {
        ...activeItem,
        data: { type: activeItem.data.type, ...info },
      };

      const res = await authenticatedFetch(
        `/shipments/${shipmentId}/${activeStep.endpoint}`,
        session,
        {
          method: "post",
          body: JSON.stringify(info),
        },
      );

      if (res && res.status === 201) {
        const newItem = await res.json();

        // TODO: apply returned values in type agnostic way
        values.id = newItem.sampleId;
        values.label = newItem.name;

        if (checkIsRoot(values)) {
          dispatch(addRootItem(values));
        } else {
          dispatch(addUnassigned(values));
        }
        toast({ title: "Successfully created item!" });
      }
    } else {
      const res = await authenticatedFetch(
        `/shipments/${shipmentId}/${activeStep.endpoint}/${activeItem.id}`,
        session,
        {
          method: "PATCH",
          body: JSON.stringify(info),
        },
      );

      if (res && res.status === 200) {
        dispatch(saveActiveItem({ ...activeItem, data: { ...activeItem.data, ...info } }));
        toast({ title: "Successfully saved item!" });
      }
    }
  });

  return (
    <VStack h='100%' w='65%'>
      <VStack spacing='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {activeStep.singular}
        </Heading>
        <HStack w='100%'>
          <Heading>{activeIsEdit ? activeItem.label : `New ${activeStep.singular}`}</Heading>
          <Spacer />
          <Button isDisabled={!activeIsEdit}>New Item</Button>
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      <FormProvider {...formContext}>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", width: "100%", flex: "1 0 auto" }}
        >
          <DynamicForm formType={activeItem.data.type} prepopData={prepopData} />
          <GridBox positions={4} />
          <HStack>
            <Spacer />
            <Button bg='red.500'>{activeIsEdit ? "Delete" : "Cancel"}</Button>
            <Button type='submit'>{activeIsEdit ? "Save" : "Add"}</Button>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

export default ItemFormPageContent;
