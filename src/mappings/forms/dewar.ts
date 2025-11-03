import { DynamicFormEntry } from "@/types/forms";
import { topLevelContainerForm } from "@/mappings/forms/topLevelContainer";

export const dewarForm = [
  ...topLevelContainerForm,
  {
    id: "code",
    label: "Dewar Code",
    type: "editableDropdown",
    validation: {
      required: true,
      maxLength: { value: 15, message: "Serial number have less than 15 characters" },
    },
    hint:
      "Select your dewar's code, or generate a new one if your dewar has no associated code." +
      "\nIf generating a new code, serial numbers are required for international shipments." +
      "\nIf your dewar has no serial code, set the value to N/A.",
    values: {
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
      base: [{ label: "Generate New Code (Specify Serial Number)", value: "other" }],
    },
  },
] as DynamicFormEntry[];
