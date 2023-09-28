import { DynamicFormEntry } from "@/components/input/form/input";

export const gridBoxForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "capacity",
    label: "Capacity",
    type: "dropdown",
    values: [
      { label: "4", value: 4 },
      { label: "12", value: 12 },
    ],
  },
  {
    id: "lid",
    label: "Lid",
    type: "dropdown",
    values: [
      { label: "4", value: 4 },
      { label: "12", value: 12 },
    ],
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
