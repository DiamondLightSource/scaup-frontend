import { DynamicFormEntry } from "@/components/input/form/input";

export const containerForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "containerType",
    label: "Container Type",
    type: "dropdown",
    values: [
      { label: "Falcon Tube", value: "falconTube" },
      { label: "Puck", value: "puck" },
      { label: "Generic", value: "generic" },
    ],
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
