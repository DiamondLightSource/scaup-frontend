import { JsonRef } from "@/utils/generic";
import { RegisterOptions } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string;
  extra?: string;
}

export interface DynamicFormEntry {
  /** Field label, displayed above/next to input */
  label: string;
  /** Field ID */
  id: string;
  /** Field type */
  type:
    | "text"
    | "dropdown"
    | "checkbox"
    | "textarea"
    | "separator"
    | "indicatorDropdown"
    | "editableDropdown";
  /** Validation options */
  validation?: RegisterOptions;
  values?: string | SelectOption[] | JsonRef;
  /** Fire event when this field changes */
  watch?: boolean;
  /** Text to be displayed underneath label, commonly used for further clarification */
  hint?: string;
  /** Disable input */
  isDisabled?: boolean;
}
