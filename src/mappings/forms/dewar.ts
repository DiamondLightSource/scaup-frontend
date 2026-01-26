import { DynamicFormEntry } from "@/types/forms";
import { topLevelContainerForm } from "@/mappings/forms/topLevelContainer";

export const dewarForm = [
  ...topLevelContainerForm,
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    hint: "Select your dewar's code, or generate a new one if your dewar has no associated code.",
    values: {
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
      base: [{ label: "Generate New Code", value: null }],
    },
  },
  {
    id: "manufacturerSerialNumber",
    label: "Manufacturer Serial Code",
    type: "text",
    hint: "If your dewar has no serial code, leave this blank. The serial code must match the code on the dewar.",
    validation: {
      maxLength: { value: 15, message: "Serial number have less than 15 characters" },
    },
  },
] as DynamicFormEntry[];
