import { DynamicFormEntry } from "@/components/input/form/input";
import { containerForm } from "@/mappings/forms/container";

export const puckForm = [
  ...containerForm,
  {
    id: "registeredContainer", // External ID?
    label: "Registered Container",
    type: "dropdown",
    values: {
      base: [{ label: "None", value: "" }],
      $ref: { parent: "#/containers", map: { value: "barcode", label: "barcode" } },
    },
    watch: true,
  },
  {
    id: "subType",
    label: "Sub Type",
    type: "dropdown",
    values: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
    ],
    watch: true,
  },
] as DynamicFormEntry[];
