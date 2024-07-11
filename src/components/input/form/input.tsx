"use client";
import "@/styles/form.css";
import { JsonRef } from "@/utils/generic";
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { RegisterOptions, useFormContext } from "react-hook-form";

export interface DynamicFormEntry {
  /** Field label, displayed above/next to input */
  label: string;
  /** Field ID */
  id: string;
  /** Field type */
  type: "text" | "dropdown" | "checkbox" | "textarea" | "separator" | "indicatorDropdown";
  /** Validation options */
  validation?: RegisterOptions;
  values?: string | { label: string; value: string; extra?: string }[] | JsonRef;
  /** Fire event when this field changes */
  watch?: boolean;
  /** Text to be displayed underneath label, commonly used for further clarification */
  hint?: string;
  /** Disable input */
  isDisabled?: boolean;
}

const indicatorMap: Record<string, string> = {
  GREEN: "🟢",
  YELLOW: "🟡",
  RED: "🔴",
};

export const getIndicatorSymbol = (v?: string) => (v ? indicatorMap[v] ?? `(${v})` : "");

const InnerDynamicFormInput = ({
  id,
  label,
  type,
  isDisabled,
  validation,
  values,
  hint,
}: DynamicFormEntry) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const textDefault = typeof values === "string" ? values : undefined;

  switch (type) {
    case "text":
      return (
        <Input
          id={id}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          defaultValue={textDefault}
          isDisabled={isDisabled}
          {...register(id, { ...validation, disabled: isDisabled })}
        ></Input>
      );
    case "textarea":
      return (
        <Textarea
          id={id}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          defaultValue={textDefault}
          isDisabled={isDisabled}
          {...register(id, { ...validation, disabled: isDisabled })}
        />
      );
    case "dropdown":
      return (
        <Select
          id={id}
          isDisabled={!values || isDisabled}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          {...register(id, { ...validation, disabled: isDisabled })}
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
    case "indicatorDropdown":
      return (
        <Select
          id={id}
          isDisabled={!values || isDisabled}
          isInvalid={!!errors[id]}
          variant='hi-contrast'
          {...register(id, { ...validation, disabled: isDisabled })}
        >
          {values &&
            Array.isArray(values) &&
            values.map((v, i) => (
              <option key={i} value={v.value}>
                {v.label} {getIndicatorSymbol(v.extra)}
              </option>
            ))}
        </Select>
      );
    case "checkbox":
      return (
        <Box my='0.5em'>
          <Checkbox size='lg' id={id} {...register(id, { ...validation, disabled: isDisabled })}>
            {label}
          </Checkbox>

          <FormHelperText ml='34px' mt='0'>
            {hint}
          </FormHelperText>
        </Box>
      );
  }
};

export const DynamicFormInput = ({
  id,
  label,
  type,
  validation,
  values,
  isDisabled,
  hint,
}: DynamicFormEntry) => {
  const {
    formState: { errors },
  } = useFormContext();

  if (type === "separator") {
    return (
      <Heading
        role='separator'
        className='separator'
        w='100%'
        fontSize='24px'
        borderBottom='1px solid black'
      >
        {label}
      </Heading>
    );
  }

  return (
    <FormControl isInvalid={!!errors[id]}>
      {type !== "checkbox" && (
        <>
          <FormLabel fontWeight='600' fontSize='18px' mb='0' htmlFor={id}>
            {label}
          </FormLabel>
          <FormHelperText mt='0'>{hint}</FormHelperText>
        </>
      )}
      <FormErrorMessage data-testid='error-message'>
        {errors[id] ? (errors[id]!.message as string) : null}
      </FormErrorMessage>
      {<InnerDynamicFormInput {...{ id, label, type, validation, values, hint, isDisabled }} />}
    </FormControl>
  );
};
