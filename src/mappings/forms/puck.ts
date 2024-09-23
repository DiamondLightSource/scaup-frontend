import { DynamicFormEntry } from "@/components/input/form/input";
import { containerForm } from "@/mappings/forms/container";

export const puckForm = [
  ...containerForm.slice(0, 2),
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
  {
    id: "registeredContainer", // External ID?
    label: "Registered Container",
    type: "dropdown",
    values: {
      $ref: { parent: "#/containers", map: { value: "actualBarcode", label: "barcode" } },
    },
    watch: true,
  },
  ...containerForm.slice(2),
] as DynamicFormEntry[];
