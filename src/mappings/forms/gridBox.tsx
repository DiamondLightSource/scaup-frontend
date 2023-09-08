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
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "7", value: 7 },
      { label: "8", value: 8 },
      { label: "9", value: 9 },
      { label: "10", value: 10 },
      { label: "11", value: 11 },
      { label: "12", value: 12 },
    ],
  },
] as DynamicFormEntry[];
