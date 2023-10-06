import { DynamicFormEntry } from "@/components/input/form/input";

export const gridBoxForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
    hint: "Ensure name matches name on grid box",
    validation: {
      required: "Grid box must have name",
    },
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
      { label: "Screw", value: "screw" },
      { label: "No screw", value: "noScrew" },
    ],
  },
  {
    id: "keepGrid",
    label: "Keep grid for future use",
    type: "checkbox",
  },
  {
    id: "fibSession",
    label: "FIB session",
    type: "checkbox",
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
