import { DynamicFormEntry, SelectOption } from "@/types/forms";
import { Select, Input } from "@chakra-ui/react";
import { useState, useCallback, ChangeEvent, useEffect, useMemo } from "react";
import { FieldError } from "react-hook-form";

export interface EditableDropdownProps
  extends Omit<DynamicFormEntry, "type" | "label" | "hint" | "values"> {
  error?: FieldError;
  onChange: (v: string) => void;
  /** Previously selected value */
  selectedValue?: string;
  values: SelectOption[];
}

export const EditableDropdown = ({
  id,
  isDisabled,
  values,
  error,
  onChange,
  selectedValue,
}: EditableDropdownProps) => {
  const [dropdownValue, setDropdownValue] = useState(values[0]?.value);
  const [textboxValue, setTextboxValue] = useState("");

  const extendedValues = useMemo(() => {
    if (!values.some((entry) => entry.value === "other")) {
      return [...values, { label: "Other", value: "other" }];
    }
    return values;
  }, [values]);

  const onDropdownChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setDropdownValue(e.target.value);

      if (e.target.value !== "other") {
        onChange(e.target.value);
      }
    },
    [onChange],
  );

  const onTextboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  useEffect(() => {
    if (selectedValue === undefined) {
      return;
    }

    // For when a pre-filled form field comes in from the controller
    const validValues = values.map((v) => v.value);
    if (validValues.includes(selectedValue)) {
      setDropdownValue(selectedValue);
    } else {
      setDropdownValue("other");
      setTextboxValue(selectedValue);
    }
  }, [selectedValue, values]);

  return (
    <>
      <Select
        id={id}
        isDisabled={!values || isDisabled}
        isInvalid={!!error}
        variant='hi-contrast'
        onChange={onDropdownChange}
        value={dropdownValue}
      >
        {values &&
          Array.isArray(extendedValues) &&
          extendedValues.map((v, i) => (
            <option key={i} value={v.value}>
              {v.label}
            </option>
          ))}
      </Select>
      {dropdownValue === "other" && (
        <Input
          mt='0.5em'
          isInvalid={!!error}
          variant='hi-contrast'
          isDisabled={isDisabled}
          onChange={onTextboxChange}
          value={textboxValue}
          placeholder='Specify...'
        ></Input>
      )}
    </>
  );
};
