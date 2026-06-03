import { DynamicFormEntry } from "@/types/forms";

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
] as DynamicFormEntry[];
