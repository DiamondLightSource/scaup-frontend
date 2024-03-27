"use client";
import { Container } from "@/components/containers";
import { DynamicForm } from "@/components/input/form";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  setIsReview,
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
import { ItemFormPageContentProps } from "@/types/generic";
import { Item } from "@/utils/client/item";
import { Box, Button, HStack, Spacer, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ItemFormPageContent = ({ shipmentId, prepopData }: ItemFormPageContentProps) => {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem ? activeItem.data.type : "sample")],
    [activeItem],
  );
  const router = useRouter();
  const [isAddLoading, setAddLoading] = useState(false);

  const activeIsEdit = useSelector(selectIsEdit);
  const formContext = useForm<BaseShipmentItem>();
  const [formType, setFormType] = useState(activeItem ? activeItem.data.type : "sample");

  useEffect(() => {
    dispatch(setIsReview(false));
    if (activeItem) {
      // If we set name to null, then it will get cleared once the form is reset
      let baseData: Record<string, any> = { type: activeItem.data.type, name: null };

      // Only existing items should draw in more data than just the type
      if (activeIsEdit) {
        baseData = { name: activeItem.name, ...activeItem.data };
      }

      formContext.reset(baseData, { keepValues: false, keepDefaultValues: false });
    }
  }, [formContext, activeItem, activeIsEdit, dispatch]);

  const onSubmit = formContext.handleSubmit(async (info: Omit<BaseShipmentItem, "type">) => {
    if (!activeIsEdit && activeItem) {
      // Temporary measure, at least whilst all samples are in grids
      setAddLoading(true);

      if (info.type === "sample") {
        info.type = "grid";
      }

      const values: TreeData<BaseShipmentItem> = {
        ...activeItem,
        data: { type: activeItem.data.type, ...info },
      };

      let newItem = await Item.create(
        shipmentId,
        separateDetails(info, activeStep.endpoint),
        activeStep.endpoint,
      );

      if (Array.isArray(newItem)) {
        newItem = newItem[0];
      }

      values.id = newItem.id;
      values.name = newItem.name ?? "";

      if (checkIsRoot(values)) {
        await dispatch(updateShipment({ shipmentId }));
      } else {
        await dispatch(updateUnassigned({ shipmentId }));
      }

      toast({ title: "Successfully created item!" });
      router.replace(`../../${info.type}/${newItem.id}/edit`);
    } else {
      await Item.patch(
        activeItem!.id,
        separateDetails(info, activeStep.endpoint),
        activeStep.endpoint,
      );
      setAddLoading(false);
      dispatch(updateShipment({ shipmentId }));
      toast({ title: "Successfully saved item!" });
    }
  });

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
    if (activeItem) {
      setFormType(activeItem.data.type);
    }
  }, [activeItem]);

  const handleWatchedUpdated = useCallback((formValues: FieldValues) => {
    setFormType(formValues.type);
  }, []);

  const redirectToNew = useCallback(() => {
    router.replace("../new/edit");
  }, [router]);

  // This does not get rendered if there is no active item, so it's safe to assume it's not null

  return (
    <FormProvider {...formContext}>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flex: "1 0 auto",
          gap: "1em",
        }}
      >
        <HStack py='3' flex='1 0 auto' alignItems='start'>
          <Box flex='1 0 auto'>
            <DynamicForm
              onWatchedUpdated={handleWatchedUpdated}
              formType={formType}
              defaultValues={activeItem!.data}
              prepopData={prepopData}
            />
          </Box>
          <Container containerType={formType} shipmentId={shipmentId} formContext={formContext} />
        </HStack>
        <HStack h='3.5em' px='1em' bg='gray.200'>
          <Spacer />
          <Button onClick={redirectToNew} isDisabled={!activeIsEdit}>
            Create New Item
          </Button>
          <Button isLoading={isAddLoading} type='submit'>
            {activeIsEdit ? "Save" : "Add"}
          </Button>
        </HStack>
      </form>
    </FormProvider>
  );
};

export default ItemFormPageContent;
