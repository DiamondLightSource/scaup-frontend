import "@/styles/form.css";
import { JsonRef } from "@/utils/generic";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { RegisterOptions, useFormContext } from "react-hook-form";

export interface DynamicFormEntry {
  label: string;
  id: string;
  type: "text" | "dropdown" | "checkbox" | "textarea" | "separator";
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
    case "textarea":
      return (
        <Textarea
          id={id}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          {...register(id, validation)}
        />
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
    formState: { errors },
  } = useFormContext();

  if (type === "separator") {
    return (
      <Heading
        role='separator'
        className='separator'
        w='100%'
        size='md'
        borderBottom='1px solid black'
      >
        {label}
      </Heading>
    );
  }

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
