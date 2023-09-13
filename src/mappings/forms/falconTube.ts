import { DynamicFormEntry } from "@/components/input/form/input";
import { containerForm } from "@/mappings/forms/container";

export const falconTubeForm = [
  ...containerForm,
  { id: "puckData", label: "Falcon Tube Data", type: "text" },
] as DynamicFormEntry[];
