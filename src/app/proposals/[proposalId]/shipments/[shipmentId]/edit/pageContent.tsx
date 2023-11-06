"use client";
import { Container } from "@/components/containers";
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
import { Item } from "@/utils/client/item";
import { Box, Button, Divider, HStack, Heading, Spacer, VStack, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
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
  const formContext = useForm<BaseShipmentItem>();
  const [formType, setFormType] = useState(activeItem.data.type);

  useEffect(() => {
    formContext.reset(activeItem.data, { keepValues: false, keepDefaultValues: false });
  }, [formContext, activeItem, activeIsEdit]);

  const onSubmit = formContext.handleSubmit(async (info: Omit<BaseShipmentItem, "type">) => {
    if (!activeIsEdit) {
      const values: TreeData<BaseShipmentItem> = {
        ...activeItem,
        data: { type: activeItem.data.type, ...info },
      };

      Item.create(
        session,
        shipmentId,
        separateDetails(info, activeStep.endpoint),
        activeStep.endpoint,
      ).then(async (newItem) => {
        values.id = newItem.id;
        values.name = newItem.name;

        if (checkIsRoot(values)) {
          await dispatch(updateShipment({ session, shipmentId }));
        } else {
          await dispatch(updateUnassigned({ session, shipmentId }));
        }

        dispatch(syncActiveItem({ id: newItem.id }));
      });
    } else {
      Item.patch(
        session,
        shipmentId,
        activeItem.id,
        separateDetails(info, activeStep.endpoint),
        activeStep.endpoint,
      ).then(() => {
        dispatch(updateShipment({ session, shipmentId }));
        toast({ title: "Successfully saved item!" });
      });
    }
  });

  const handleNewItem = useCallback(() => {
    dispatch(setNewActiveItem({ type: activeItem.data.type, title: activeStep.title }));
  }, [dispatch, activeStep, activeItem]);

  /*
   * Should we perform a cascade delete, and delete the entire chain of children for the current object?
   * I'd rather have the user perform this "explicitly", hence, why they should use the overview on
   * the right
   */

  /*const handleDelete = useCallback(async () => {
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
  }, [handleNewItem, dispatch, activeIsEdit, activeItem, activeStep, session, shipmentId]);*/

  useEffect(() => {
    setFormType(activeItem.data.type);
  }, [activeItem]);

  const handleWatchedUpdated = useCallback((formValues: FieldValues) => {
    setFormType(formValues.type);
  }, []);

  return (
    <VStack alignItems='stretch' w='65%'>
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
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: "1 0 auto",
          }}
        >
          <HStack py='3' flex='1 0 auto' alignItems='start'>
            <Box flex='1 0 auto'>
              <DynamicForm
                onWatchedUpdated={handleWatchedUpdated}
                formType={formType}
                defaultValues={activeItem.data}
                prepopData={prepopData}
              />
            </Box>
            <Container containerType={formType} shipmentId={shipmentId} formContext={formContext} />
          </HStack>
          <HStack p='0.5em' bg='gray.200'>
            <Spacer />
            <Button type='submit'>{activeIsEdit ? "Save" : "Add"}</Button>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

export default ItemFormPageContent;
