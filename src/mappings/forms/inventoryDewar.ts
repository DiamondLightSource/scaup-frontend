import { DynamicFormEntry } from "@/types/forms";
import { topLevelContainerForm } from "@/mappings/forms/topLevelContainer";
import { nameValidation } from "@/utils/generic";

export const inventoryDewar = [
  {
    id: "name",
    label: "Name",
    type: "text",
    validation: {
      ...nameValidation,
      required: "Required",
    },
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
