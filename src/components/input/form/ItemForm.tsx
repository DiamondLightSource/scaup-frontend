"use client";
import { Container } from "@/components/containers";
import { DynamicForm, DynamicFormProps, formMapping } from "@/components/input/form";
import { DynamicFormEntry } from "@/types/forms";
import { selectActiveItem, selectIsEdit, setIsReview } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { RootParentType } from "@/types/generic";
import { Box, Button, HStack, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface ItemFormProps {
  parentId: string;
  prepopData?: DynamicFormProps["prepopData"];
  parentType?: RootParentType;
  onSubmit: (values: FieldValues) => Promise<void>;
}

export const ItemForm = ({
  parentId,
  prepopData,
  onSubmit,
  parentType = "topLevelContainer",
}: ItemFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const router = useRouter();
  const [isAddLoading, setAddLoading] = useState(false);

  const activeIsEdit = useSelector(selectIsEdit);
  const formContext = useForm<BaseShipmentItem>({ shouldUnregister: true });
  const [formType, setFormType] = useState("sample");
  const [formSubType, setFormSubType] = useState<string | undefined>(undefined);
  const [renderedForm, setRenderedForm] = useState<DynamicFormEntry[]>([]);

  const isCreationDisabled = useMemo(() => parentType === "topLevelContainer", [parentType]);

  useEffect(() => {
    const newForm = formMapping[formType];

    if (formType === "dewar" && parentType === "topLevelContainer") {
      newForm[newForm.findIndex((field) => field.id === "code")].isDisabled = true;
    }

    setRenderedForm(newForm);
  }, [formType, parentType]);

  const handleWatchedUpdated = useCallback((formValues: FieldValues) => {
    if ("type" in formValues) {
      setFormType(formValues.type);
    }

    if ("subType" in formValues) {
      setFormSubType(formValues.subType);
    }

    if ("registeredContainer" in formValues) {
      setRenderedForm((oldForm) => {
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

      formContext.reset(baseData);
      handleWatchedUpdated(baseData);
    }
  }, [formContext, activeItem, activeIsEdit, dispatch, handleWatchedUpdated]);

  const onFormSubmit = useCallback(
    async (info: FieldValues) => {
      setAddLoading(true);
      try {
        let patchedValues = info;
        if (activeItem) {
          patchedValues = { type: activeItem.data.type, ...info };
        }
        await onSubmit(patchedValues);
      } finally {
        setAddLoading(false);
      }
    },
    [onSubmit, activeItem],
  );

  useEffect(() => {
    if (activeItem) {
      setFormType(activeItem.data.type);
      setFormSubType(activeItem.data.subType);
    }
  }, [activeItem]);

  const redirectToNew = useCallback(() => {
    if (parentType === "shipment") {
      router.replace("../new/edit");
    }
    // Do not trigger if parent is not shipment
  }, [router, parentType]);

  // This does not get rendered if there is no active item, so it's safe to assume it's not null

  return (
    <FormProvider {...formContext}>
      <form
        onSubmit={formContext.handleSubmit(onFormSubmit)}
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
              formType={renderedForm}
              prepopData={prepopData}
            />
          </Box>
          <Container
            containerSubType={formSubType}
            containerType={formType}
            parentId={parentId}
            formContext={formContext}
            parentType={parentType}
          />
        </HStack>
        <HStack h='3.5em' px='1em' bg='gray.200'>
          <Spacer />
          <Button onClick={redirectToNew} isDisabled={!activeIsEdit || isCreationDisabled}>
            Create New Item
          </Button>
          <Button
            isLoading={isAddLoading}
            isDisabled={isCreationDisabled && !activeIsEdit}
            type='submit'
          >
            {activeIsEdit ? "Save" : "Add"}
          </Button>
        </HStack>
      </form>
    </FormProvider>
  );
};
