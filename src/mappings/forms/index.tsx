import { DynamicFormEntry, DynamicFormInput } from "@/components/input/formInput";
import { sampleForm } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { VStack } from "@chakra-ui/react";
import { useMemo } from "react";

export interface DynamicFormProps {
  /** Form input type */
  formType: BaseShipmentItem["type"];
}

export const formMapping: Record<BaseShipmentItem["type"], DynamicFormEntry[]> = {
  sample: sampleForm,
  puck: [],
  falconTube: [],
  dewar: [],
  grid: [],
  gridBox: [],
};

export const DynamicForm = ({ formType, ...props }: DynamicFormProps) => {
  const forms = useMemo(() => formMapping[formType], [formType]);

  return (
    <VStack flex='1 0 auto' py='3' spacing='3'>
      {forms.map((entry) => (
        <DynamicFormInput key={entry.id} {...props} {...entry} />
      ))}
    </VStack>
  );
};
