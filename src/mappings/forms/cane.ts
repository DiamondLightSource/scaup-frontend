import { DynamicFormEntry } from "@/types/forms";
import { commentValidation, nameValidation } from "@/utils/generic";

export const caneForm = [
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
    validation: {
      ...commentValidation
    }
  },
] as DynamicFormEntry[];
