import { JsonRef } from "@/utils/generic";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { RegisterOptions, useFormContext } from "react-hook-form";

export interface DynamicFormEntry {
  label: string;
  id: string;
  type: "text" | "dropdown" | "checkbox";
  validation?: RegisterOptions;
  values?: string | { label: string; value: string }[] | JsonRef;
}

const InnerDynamicFormInput = ({ id, label, type, validation, values }: DynamicFormEntry) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  switch (type) {
    case "text":
      return (
        <Input
          id={id}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          {...register(id, validation)}
        ></Input>
      );
    case "dropdown":
      return (
        <Select
          id={id}
          isDisabled={!values}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          {...register(id, validation)}
        >
          {values &&
            Array.isArray(values) &&
            values.map((v, i) => (
              <option key={i} value={v.value}>
                {v.label}
              </option>
            ))}
        </Select>
      );
    case "checkbox":
      return (
        <Checkbox id={id} {...register(id, validation)}>
          {label}
        </Checkbox>
      );
  }
};

export const DynamicFormInput = ({ id, label, type, validation, values }: DynamicFormEntry) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[id]}>
      {type !== "checkbox" && (
        <FormLabel fontWeight='600' mb='0' htmlFor={id}>
          {label}
        </FormLabel>
      )}
      <FormErrorMessage>{errors[id] ? (errors[id]!.message as string) : null}</FormErrorMessage>
      {<InnerDynamicFormInput {...{ id, label, type, validation, values }} />}
    </FormControl>
  );
};
