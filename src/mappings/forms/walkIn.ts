import { DynamicFormEntry } from "@/types/forms";
import { topLevelContainerForm } from "@/mappings/forms/topLevelContainer";
import { nameValidation } from "@/utils/generic";

export const walkInForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
    validation: {
      ...nameValidation,
      required: "Required",
    },
  },
  ...topLevelContainerForm,
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    values: {
      base: [{ label: "None", value: "" }],
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
    },
  },
] as DynamicFormEntry[];
