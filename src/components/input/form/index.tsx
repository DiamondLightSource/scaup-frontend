"use client";
import { DynamicFormEntry, DynamicFormInput } from "@/components/input/form/input";
import { formMapping } from "@/mappings/forms";
import { BaseShipmentItem } from "@/mappings/pages";
import { parseJsonReferences } from "@/utils/generic";
import { VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { FieldValues, useFormContext, useWatch } from "react-hook-form";

export interface DynamicFormProps {
  /** Form input type */
  formType: BaseShipmentItem["type"] | DynamicFormEntry[];
  /** Default values */
  defaultValues?: Record<string, any>;
  /** Data to prepopulate the form fields with. Useful for dynamic dropdowns */
  prepopData?: Record<string, any>;
  /** Callback for updated watched items */
  onWatchedUpdated?: (formValues: FieldValues) => void;
}

export const DynamicForm = ({
  defaultValues,
  prepopData,
  formType,
  onWatchedUpdated,
  ...props
}: DynamicFormProps) => {
  const { getValues } = useFormContext();
  const activeForm = useMemo(() => {
    if (Array.isArray(formType)) {
      return formType;
    }

    const form = structuredClone(formMapping[formType] ?? []);

    for (const field of form) {
      if (field.values && !Array.isArray(field.values)) {
        let fieldValues: DynamicFormEntry["values"] = [];
        if (prepopData) {
          fieldValues = parseJsonReferences(field.values, prepopData);
        }
        field.values = fieldValues;
      }
    }

    return form;
  }, [prepopData, formType]);

  const toWatch = useMemo(() => {
    const newToWatch: string[] = [];
    for (const field of activeForm) {
      if (field.watch) {
        newToWatch.push(field.id);
      }
    }
    return newToWatch;
  }, [activeForm]);

  const watchedItems = useWatch({ name: toWatch });

  useEffect(() => {
    if (onWatchedUpdated && watchedItems.length) {
      onWatchedUpdated(getValues());
    }
  }, [watchedItems, getValues, onWatchedUpdated]);

  return (
    <VStack spacing='3'>
      {/*<HStack alignItems='center' borderLeft='3px solid' borderColor='gray.600' h='40px' w='100%'>
        <Text px='1em'>Assign containers to dewar</Text>
  </HStack>*/}
      {activeForm.map((entry) => (
        <DynamicFormInput key={entry.id} {...props} {...entry} />
      ))}
    </VStack>
  );
};
export { formMapping };
