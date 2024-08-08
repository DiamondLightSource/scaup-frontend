import { DynamicFormEntry } from "@/components/input/form/input";
import { containerForm } from "@/mappings/forms/container";
import { nameValidation } from "@/utils/generic";

export const caneForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
    validation: {
      ...nameValidation,
    },
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
