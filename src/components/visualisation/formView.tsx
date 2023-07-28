import { formMapping } from "@/mappings/forms";
import { BaseShipmentItem } from "@/mappings/pages";
import { Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";

export interface DynamicFormViewProps {
  formType: BaseShipmentItem["type"];
  data: BaseShipmentItem;
}

interface DynamicFormViewFieldProps {
  children: string;
  label: string;
}

export const DynamicFormView = ({ formType, data }: DynamicFormViewProps) => {
  const formData = useMemo(() => {
    const form: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const field = formMapping[formType].find((field) => field.id === key);
      if (field) {
        form[field.label] = value;
      }
    }
    return form;
  }, [data, formType]);

  return (
    <>
      {Object.entries(formData).map(([key, value]) => (
        <DynamicFormViewField key={key} label={key}>
          {value}
        </DynamicFormViewField>
      ))}
    </>
  );
};

const DynamicFormViewField = ({ children, label }: DynamicFormViewFieldProps) => {
  return (
    <VStack alignItems='start' gap='0'>
      <HStack py='9px'>
        <Text w='170px' fontWeight='800'>
          {label}
        </Text>
        <Text>{children}</Text>
      </HStack>
      <Divider borderColor='grey.600' />
    </VStack>
  );
};
