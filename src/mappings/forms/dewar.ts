import { DynamicFormEntry } from "@/types/forms";
import { topLevelContainerForm } from "@/mappings/forms/topLevelContainer";

export const dewarForm = [
  ...topLevelContainerForm,
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    hint: "Select the code on your dewar, or generate a new one if you dewar has no associated code",
    values: {
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
      base: [{ label: "Generate New Code", value: "" }],
    },
  },
] as DynamicFormEntry[];
