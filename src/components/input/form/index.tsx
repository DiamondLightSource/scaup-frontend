"use client";
import { DynamicFormInput } from "@/components/input/form/input";
import { formMapping } from "@/mappings/forms";
import { DynamicFormEntry } from "@/types/forms";
import { parseJsonReferences } from "@/utils/generic";
import { VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { FieldValues, useFormContext, useWatch } from "react-hook-form";

export interface DynamicFormProps {
  /** Form structure */
  formType: DynamicFormEntry[];
  /** Data to prepopulate the form fields with. Useful for dynamic dropdowns */
  prepopData?: Record<string, any>;
  /** Callback for updated watched items */
  onWatchedUpdated?: (formValues: FieldValues) => void;
}

export const DynamicForm = ({
  prepopData,
  formType,
  onWatchedUpdated,
  ...props
}: DynamicFormProps) => {
  const { getValues } = useFormContext();
  const activeForm = useMemo(() => {
    const form = structuredClone(formType);

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
      {activeForm.map((entry) => (
        <DynamicFormInput key={entry.id} {...props} {...entry} />
      ))}
    </VStack>
  );
};
export { formMapping };
