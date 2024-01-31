import { DynamicFormEntry } from "@/components/input/form/input";

export const dewarForm = [
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    values: {
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
    },
    validation: {
      required: "Required",
    },
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
