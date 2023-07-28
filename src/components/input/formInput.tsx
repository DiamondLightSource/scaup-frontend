import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface DynamicFormEntry {
  label: string;
  id: string;
  type: "text" | "dropdown" | "checkbox";
  validation?: RegisterOptions;
  values?: { label: string; value: string }[];
}

export interface DynamicFormInputProps extends DynamicFormEntry {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

const InnerDynamicFormInput = ({
  id,
  label,
  type,
  validation,
  values,
  register,
  errors,
}: DynamicFormInputProps) => {
  switch (type) {
    case "text":
      return (
        <Input isInvalid={!!errors[id]} variant='hi-contrast' {...register(id, validation)}></Input>
      );
    case "dropdown":
      if (!values) {
        return null;
      }
      return (
        <Select isInvalid={!!errors[id]} variant='hi-contrast' {...register(id, validation)}>
          {values.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </Select>
      );
    case "checkbox":
      return <Checkbox {...register(id, validation)}>{label}</Checkbox>;
    default:
      return null;
  }
};

export const DynamicFormInput = ({
  id,
  label,
  type,
  validation,
  values,
  errors,
  register,
}: DynamicFormInputProps) => (
  <FormControl isInvalid={!!errors[id]}>
    {type !== "checkbox" && (
      <FormLabel fontWeight='600' mb='0' htmlFor={id}>
        {label}
      </FormLabel>
    )}
    <FormErrorMessage>{errors[id] ? (errors[id]!.message as string) : null}</FormErrorMessage>
    {<InnerDynamicFormInput {...{ id, label, type, validation, values, register, errors }} />}
  </FormControl>
);
