import { DynamicFormEntry } from "@/components/input/form/input";
import { containerForm } from "@/mappings/forms/container";

export const puckForm = [
  ...containerForm,
  { id: "puckData", label: "Puck Data", type: "text" },
] as DynamicFormEntry[];
