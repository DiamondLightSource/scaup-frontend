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
] as DynamicFormEntry[];
