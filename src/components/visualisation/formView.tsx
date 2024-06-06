import { formMapping } from "@/components/input/form";
import { DynamicFormEntry, getIndicatorSymbol } from "@/components/input/form/input";
import { BaseShipmentItem } from "@/mappings/pages";
import { parseJsonReferences } from "@/utils/generic";
import { Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";

export interface DynamicFormViewProps {
  /** Predefined form type to use for displaying data, or custom form definition */
  formType: BaseShipmentItem["type"] | DynamicFormEntry[];
  data: Record<string, any>;
  /**
   * Same prepopulation data passed to original form, used for displaying the original
   * human readable values. TODO: type this with the return value from the server
   */
  prepopData?: Record<string, any>;
}

interface DynamicFormViewFieldProps {
  children: string;
  label: string;
}

export const DynamicFormView = ({ formType, data, prepopData }: DynamicFormViewProps) => {
  const formData = useMemo(() => {
    const form: Record<string, any> = {};
    const formDefinition = typeof formType === "string" ? formMapping[formType] : formType;

    for (const [key, value] of Object.entries(data)) {
      const field = formDefinition.find((field) => field.id === key);
      if (field) {
        let actualValue = value;
        if (typeof actualValue === "boolean") {
          actualValue = actualValue ? "Yes" : "No";
        } else if (
          (field.type === "dropdown" || field.type === "indicatorDropdown") &&
          field.values &&
          !Array.isArray(field.values) &&
          prepopData
        ) {
          /*
           * An alternative to remapping IDs to human readable values in the front end would be
           * assigning these values in the backend, so that both the ID and the label are returned.
           *
           * However, this would break the "simple" key/value model used in the shipment object and
           * would greatly increase parsing complexity anyway. This is a compromise that aims to
           * implement an optimal alternative.
           */
          const options: DynamicFormEntry["values"] = parseJsonReferences(field.values, prepopData);

          if (Array.isArray(options)) {
            const option = options.find((option) => option.value === value);
            if (option) {
              actualValue = option.label;
              if (field.type === "indicatorDropdown") {
                actualValue += ` ${getIndicatorSymbol(option.extra)}`;
              }
            }
          }
        }

        form[field.label] = actualValue;
      }
    }
    return form;
  }, [data, formType, prepopData]);

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
    <VStack alignItems='start' gap='0' w='100%'>
      <HStack py='9px'>
        <Text w='240px' fontWeight='800'>
          {label}
        </Text>
        <Text>{children}</Text>
      </HStack>
      <Divider borderColor='grey.600' />
    </VStack>
  );
};
