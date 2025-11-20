"use client";
import "@/styles/form.css";
import { DynamicFormEntry } from "@/types/forms";
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
import { Controller, useFormContext } from "react-hook-form";
import { EditableDropdown } from "@/components/input/EditableDropdown";

const indicatorMap: Record<string, string> = {
  GREEN: "🟢",
  YELLOW: "🟡",
  RED: "🔴",
};

export const getIndicatorSymbol = (v?: string) => (v ? (indicatorMap[v] ?? `(${v})`) : "");

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
    control,
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
    case "editableDropdown":
      if (!Array.isArray(values)) {
        throw new Error("Editable dropdown only accepts array of fields");
      }

      return (
        <Controller
          control={control}
          name={id}
          rules={validation}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <EditableDropdown
                id={id}
                values={values}
                isDisabled={isDisabled}
                error={error}
                onChange={onChange}
                selectedValue={value}
              />
            );
          }}
        />
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
    <FormControl
      isInvalid={!!errors[id]}
      isRequired={!!validation?.required}
      isDisabled={isDisabled}
    >
      {type !== "checkbox" && (
        <>
          <FormLabel fontWeight='600' fontSize='18px' mb='0' htmlFor={id}>
            {label}
          </FormLabel>
          <FormHelperText aria-multiline='true' whiteSpace='pre-line' mt='0' mb='0.2em'>
            {hint}
          </FormHelperText>
        </>
      )}
      <FormErrorMessage data-testid='error-message'>
        {errors[id] ? (errors[id]!.message as string) : null}
      </FormErrorMessage>
      {<InnerDynamicFormInput {...{ id, label, type, validation, values, hint, isDisabled }} />}
    </FormControl>
  );
};
