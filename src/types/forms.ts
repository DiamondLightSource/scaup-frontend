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

export interface TreeData<T = any> {
  /** Node label */
  name: string;
  /** Unique node ID */
  id: string | number;
  /** Tag prefixed to label */
  tag?: string;
  /** Node data */
  data: T;
  /** Node children */
  children?: TreeData[] | null;
  /** Should 'remove' button be invisible */
  isUndeletable?: boolean;
  /** Should 'view' button be invisible */
  isNotViewable?: boolean;
}
