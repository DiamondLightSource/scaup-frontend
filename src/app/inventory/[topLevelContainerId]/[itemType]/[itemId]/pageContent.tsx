"use client";
import { Container } from "@/components/containers";
import { DynamicForm, formMapping } from "@/components/input/form";
import { DynamicFormEntry } from "@/components/input/form/input";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  setIsReview,
  setNewActiveItem,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import {
  BaseShipmentItem,
  getCurrentStepIndex,
  internalEbicSteps,
  separateDetails,
} from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { InventoryItemParams } from "@/types/generic";
import { Item } from "@/utils/client/item";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Skeleton,
  Spacer,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export const ItemFormPageContent = ({ params }: { params: InventoryItemParams }) => {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () =>
      internalEbicSteps[
        getCurrentStepIndex(activeItem ? activeItem.data.type : "sample", internalEbicSteps)
      ],
    [activeItem],
  );
  const router = useRouter();
  const [isAddLoading, setAddLoading] = useState(false);

  const activeIsEdit = useSelector(selectIsEdit);
  const formContext = useForm<BaseShipmentItem>();
  const [formType, setFormType] = useState(activeItem ? activeItem.data.type : "sample");
  const [renderedForm, setRenderedForm] = useState<DynamicFormEntry[]>([]);

  useEffect(() => {
    if (params.itemId !== "new") {
      dispatch(syncActiveItem({ id: Number(params.itemId), type: params.itemType }));
    } else {
      dispatch(setNewActiveItem({ type: params.itemType, title: params.itemType }));
    }
  }, [params, dispatch]);

  useEffect(() => {
    setRenderedForm(formMapping[formType]);
  }, [formType]);

  const handleWatchedUpdated = useCallback((formValues: FieldValues) => {
    if ("type" in formValues) {
      setFormType(formValues.type);
    }

    if ("registeredContainer" in formValues) {
      setRenderedForm((oldForm) => {
        if (!oldForm) {
          return oldForm;
        }
        const newForm = structuredClone(oldForm);
        const nameIndex = newForm.findIndex((field) => field.id === "name");
        if (nameIndex !== -1) {
          newForm[nameIndex].isDisabled =
            formValues.registeredContainer !== "" && formValues.registeredContainer !== null;
        }
        return newForm;
      });
    }
  }, []);

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
      handleWatchedUpdated(baseData);
    }
  }, [formContext, activeItem, activeIsEdit, dispatch, handleWatchedUpdated]);

  const onSubmit = formContext.handleSubmit(async (info: Omit<BaseShipmentItem, "type">) => {
    if (!activeIsEdit && activeItem) {
      setAddLoading(true);

      // Temporary measure, at least whilst all samples are in grids
      if (info.type === "sample") {
        info.type = "grid";
      }

      const values: TreeData<BaseShipmentItem> = {
        ...activeItem,
        data: { type: activeItem.data.type, ...info },
      };

      try {
        let newItem = await Item.create(
          params.topLevelContainerId,
          separateDetails(info, activeStep.endpoint),
          activeStep.endpoint,
          "topLevelContainer",
        );

        if (Array.isArray(newItem)) {
          newItem = newItem[0];
        }

        toast({ title: "Successfully created item!" });

        values.id = newItem.id;
        values.name = newItem.name ?? "";

        router.replace(`../${info.type}/${newItem.id}`, { scroll: false });
      } catch {
        setAddLoading(false);
      }
    } else {
      try {
        await Promise.all([
          Item.patch(
            activeItem!.id,
            separateDetails(info, activeStep.endpoint),
            activeStep.endpoint,
          ),
          dispatch(
            updateShipment({
              shipmentId: params.topLevelContainerId,
              parentType: "topLevelContainer",
            }),
          ),
          await dispatch(
            updateUnassigned({
              shipmentId: params.topLevelContainerId,
              parentType: "topLevelContainer",
            }),
          ),
        ]);

        toast({ title: "Successfully saved item!" });
        router.replace(`../${info.type}/${activeItem!.id}`, { scroll: false });
      } catch {
        setAddLoading(false);
      }
    }
    setAddLoading(false);
  });

  useEffect(() => {
    if (activeItem) {
      setFormType(activeItem.data.type);
    }
  }, [activeItem]);

  const redirectToNew = useCallback(() => {
    router.replace("new");
  }, [router]);

  return (
    <>
      {activeItem ? (
        <VStack w='100%' h='100%' alignItems='start' gap='0'>
          <Heading size='md' color='gray.600'>
            {activeStep.singular}
          </Heading>
          <HStack w='100%'>
            <Heading>{activeIsEdit ? activeItem.name : `New ${activeStep.singular}`}</Heading>
            <Spacer />
          </HStack>
          <Divider borderColor='gray.800' />
          <FormProvider {...formContext}>
            <form
              onSubmit={onSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
                flex: "1 0 0",
                width: "100%",
              }}
            >
              <HStack py='3' flex='1 0 auto' alignItems='start'>
                <Box flex='1 0 auto'>
                  <DynamicForm
                    onWatchedUpdated={handleWatchedUpdated}
                    formType={renderedForm}
                    defaultValues={activeItem?.data ?? undefined}
                  />
                </Box>
                <Container
                  containerType={formType}
                  parentId={params.topLevelContainerId}
                  formContext={formContext}
                  parentType='topLevelContainer'
                />
              </HStack>
              <HStack h='3.5em' px='1em' bg='gray.200'>
                <Spacer />
                <Button
                  onClick={redirectToNew}
                  isDisabled={
                    !activeIsEdit ||
                    ["dewar", "grid", "sample"].includes(activeItem?.data.type ?? "")
                  }
                >
                  Create New Item
                </Button>
                <Button isLoading={isAddLoading} type='submit'>
                  {activeIsEdit ? "Save" : "Add"}
                </Button>
              </HStack>
            </form>
          </FormProvider>
        </VStack>
      ) : (
        <VStack alignItems='stretch' h='100%' w='100%'>
          <Skeleton h='4em' />
          <Skeleton flex='1 0 0' />
          <Skeleton h='3.5em' />
        </VStack>
      )}
    </>
  );
};
