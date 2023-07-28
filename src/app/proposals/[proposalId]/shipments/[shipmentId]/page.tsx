"use client";

import { GridBox } from "@/components/containers/gridBox";
import {
  addRootItem,
  addUnassigned,
  saveActiveItem,
  selectActiveItem,
  selectIsEdit,
} from "@/features/shipment/shipmentSlice";
import { DynamicForm } from "@/mappings/forms";
import { BaseShipmentItem, checkIsRoot, getCurrentStepIndex, steps } from "@/mappings/pages";
import { genUniqueId } from "@/utils/generic";
import { Button, Divider, HStack, Heading, Spacer, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ItemFormPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem.data.type)].singular,
    [activeItem],
  );

  const activeIsEdit = useSelector(selectIsEdit);
  const formContext = useForm<BaseShipmentItem>({ defaultValues: activeItem.data });

  useEffect(() => {
    formContext.reset(activeItem.data, { keepValues: false, keepDefaultValues: true });
  }, [formContext, activeItem, activeIsEdit]);

  const onSubmit = formContext.handleSubmit((info: Omit<BaseShipmentItem, "type">) => {
    if (!activeIsEdit) {
      const values = {
        ...activeItem,
        id: genUniqueId(),
        title: "TEST",
        data: { type: activeItem.data.type, ...info },
      };
      if (checkIsRoot(values)) {
        dispatch(addRootItem(values));
      } else {
        dispatch(addUnassigned(values));
      }
      toast({ title: "Successfully created item!" });
    } else {
      dispatch(saveActiveItem({ ...activeItem, data: { ...activeItem.data, ...info } }));
      toast({ title: "Successfully saved item!" });
    }
  });

  return (
    <VStack h='100%' w='65%'>
      <VStack spacing='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {activeStep}
        </Heading>
        <HStack w='100%'>
          <Heading>{activeIsEdit ? activeItem.label : `New ${activeStep}`}</Heading>
          <Spacer />
          <Button isDisabled={!activeIsEdit}>Create New</Button>
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      <FormProvider {...formContext}>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", width: "100%", flex: "1 0 auto" }}
        >
          <DynamicForm formType={activeItem.data.type} />
          <HStack>
            <Button bg='red.500'>{activeIsEdit ? "Delete" : "Cancel"}</Button>
            <Button type='submit'>{activeIsEdit ? "Save" : "Add"}</Button>
          </HStack>
        </form>
      </FormProvider>
      <GridBox positions={8} />
    </VStack>
  );
};

export default ItemFormPage;
