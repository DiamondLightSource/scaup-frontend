import { DynamicFormEntry } from "@/types/forms";
import { topLevelContainerForm } from "@/mappings/forms/topLevelContainer";

export const dewarForm = [
  ...topLevelContainerForm,
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    values: {
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
    },
    validation: {
      required: "Required",
    },
  },
] as DynamicFormEntry[];
