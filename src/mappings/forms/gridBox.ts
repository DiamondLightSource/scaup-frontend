import { DynamicFormEntry } from "@/types/forms";
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
    id: "subType",
    label: "Type",
    hint: "Please select the closest type to the one you're using",
    type: "dropdown",
    values: [
      { label: "Auto Grid Box", value: "auto" },
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
    ],
    watch: true,
  },
  {
    id: "c-clip",
    label: "C-Clip Direction",
    type: "dropdown",
    values: [
      { label: "Anti-Clockwise", value: "Anti-Clockwise" },
      { label: "Clockwise", value: "Clockwise" },
    ],
  },
  {
    id: "store",
    label: "Keep gridbox at facility for future use",
    hint: "Please inform lab contact",
    type: "checkbox",
    isDisabled: true,
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
