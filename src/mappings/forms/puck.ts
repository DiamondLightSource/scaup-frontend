import { DynamicFormEntry } from "@/components/input/form/input";
import { containerForm } from "@/mappings/forms/container";

export const puckForm = [
  ...containerForm,
  {
    id: "registeredContainer", // External ID?
    label: "Registered Container",
    type: "dropdown",
    values: {
      $ref: { parent: "#/containers", map: { value: "containerRegistryId", label: "barcode" } },
    },
    validation: {
      required: "Required",
    },
  },
] as DynamicFormEntry[];
