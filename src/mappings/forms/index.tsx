import { DynamicFormEntry, DynamicFormInput } from "@/components/input/formInput";
import { dewarForm } from "@/mappings/forms/dewar";
import { sampleForm } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { parseJsonReferences } from "@/utils/generic";
import { VStack } from "@chakra-ui/react";
import { useMemo } from "react";

export interface DynamicFormProps {
  /** Form input type */
  formType: BaseShipmentItem["type"];
  /** Data to prepopulate the form with. Useful for dynamic dropdowns */
  prepopData?: Record<string, any>;
}

export const formMapping: Record<BaseShipmentItem["type"], DynamicFormEntry[]> = {
  sample: sampleForm,
  puck: [],
  falconTube: [],
  dewar: dewarForm,
  grid: [],
  gridBox: [],
};

export const DynamicForm = ({ formType, prepopData, ...props }: DynamicFormProps) => {
  const activeForm = useMemo(() => {
    const form = structuredClone(formMapping[formType]);

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

  return (
    <VStack flex='1 0 auto' py='3' spacing='3'>
      {activeForm.map((entry) => (
        <DynamicFormInput key={entry.id} {...props} {...entry} />
      ))}
    </VStack>
  );
};
