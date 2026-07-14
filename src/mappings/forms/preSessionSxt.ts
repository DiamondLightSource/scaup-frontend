import { DynamicFormEntry } from "@/types/forms";
import { commentValidation } from "@/utils/generic";

export const preSessionSxtForm = [
  {
    id: "gridSeparator",
    label: "Grid Information",
    type: "separator",
  },
  {
    id: "clipped",
    label: "Grid Clipped",
    type: "checkbox",
    hint: "Whether your grids were clipped or not",
  },
  {
    id: "comments",
    label: "Any other information relevant to your session?",
    type: "textarea",
    validation: {
      ...commentValidation
    }
  },
] as DynamicFormEntry[];
