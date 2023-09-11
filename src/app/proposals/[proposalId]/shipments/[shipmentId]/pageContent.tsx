"use client";
import { GridBox } from "@/components/containers/gridBox";
import { DynamicForm } from "@/components/input/form";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  setNewActiveItem,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import {
  BaseShipmentItem,
  checkIsRoot,
  getCurrentStepIndex,
  separateDetails,
  steps,
} from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { authenticatedFetch } from "@/utils/client";
import { Box, Button, Divider, HStack, Heading, Spacer, VStack, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface ItemFormPageContentProps {
  shipmentId: string;
  // TODO: use actual type
  prepopData: Record<string, any>;
}

const ItemFormPageContent = ({ shipmentId, prepopData }: ItemFormPageContentProps) => {
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

      const res = await authenticatedFetch.client(
        `/shipments/${shipmentId}/${activeStep.endpoint}`,
        session,
        {
          method: "post",
          body: JSON.stringify(separateDetails(info)),
        },
      );

      if (res && res.status === 201) {
        const newItem = await res.json();

        values.id = newItem.id;
        values.name = newItem.name;

        if (checkIsRoot(values)) {
          await dispatch(updateShipment({ session, shipmentId }));
        } else {
          await dispatch(updateUnassigned({ session, shipmentId }));
        }

        dispatch(syncActiveItem(newItem.id));
        toast({ title: "Successfully created item!" });
      }
    } else {
      const res = await authenticatedFetch.client(
        `/shipments/${shipmentId}/${activeStep.endpoint}/${activeItem.id}`,
        session,
        {
          method: "PATCH",
          body: JSON.stringify(separateDetails(info)),
        },
      );

      if (res && res.status === 200) {
        dispatch(updateShipment({ session, shipmentId }));
        toast({ title: "Successfully saved item!" });
      }
    }
  });

  const handleNewItem = useCallback(() => {
    dispatch(setNewActiveItem({ type: activeItem.data.type, title: activeStep.title }));
  }, [dispatch, activeStep, activeItem]);

  const handleDelete = useCallback(async () => {
    if (activeIsEdit) {
      const response = await authenticatedFetch.client(
        `/shipments/${shipmentId}/${activeStep.endpoint}/${activeItem.id}`,
        session,
        {
          method: "DELETE",
        },
      );

      if (response && response.status === 204) {
        dispatch(updateShipment({ session, shipmentId }));
        dispatch(updateUnassigned({ session, shipmentId }));
        handleNewItem();
      }
    }
  }, [handleNewItem, dispatch, activeIsEdit, activeItem, activeStep, session, shipmentId]);

  return (
    <VStack h='100%' w='65%'>
      <VStack spacing='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {activeStep.singular}
        </Heading>
        <HStack w='100%'>
          <Heading>{activeIsEdit ? activeItem.name : `New ${activeStep.singular}`}</Heading>
          <Spacer />
          <Button isDisabled={!activeIsEdit} onClick={handleNewItem}>
            New Item
          </Button>
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      <FormProvider {...formContext}>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", width: "100%", flex: "1 0 auto" }}
        >
          <HStack py='3' flex='1 0 auto' alignItems='start'>
            <Box flex='1 0 auto'>
              <DynamicForm formType={activeItem.data.type} prepopData={prepopData} />
            </Box>
            <GridBox shipmentId={shipmentId} />
          </HStack>
          <HStack>
            <Spacer />
            <Button onClick={handleDelete} bg='red.500'>
              {activeIsEdit ? "Delete" : "Cancel"}
            </Button>
            <Button type='submit'>{activeIsEdit ? "Save" : "Add"}</Button>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

export default ItemFormPageContent;
