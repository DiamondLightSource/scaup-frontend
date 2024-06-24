import { DynamicFormEntry } from "@/components/input/form/input";
import { nameValidation } from "@/utils/generic";

export const gridBoxForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
    hint: "Ensure name matches name on grid box",
    validation: {
      ...nameValidation,
      required: "Required",
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
      { label: "Screw", value: "Screw" },
      { label: "No screw", value: "No screw" },
    ],
  },
  {
    id: "fibSession",
    label: "FIB followed by TEM",
    type: "checkbox",
  },
  {
    id: "store",
    label: "Keep gridbox at facility for future use",
    hint: "Please inform lab contact",
    type: "checkbox",
  },
  {
    id: "comments",
    label: "Comments",
    hint: "General comments, such as 'gridbox requires special tools to open'",
    type: "textarea",
  },
] as DynamicFormEntry[];
