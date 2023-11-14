import { DynamicFormEntry } from "@/components/input/form/input";

export const dewarForm = [
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    values: {
      $ref: { parent: "#/dewars", map: { value: "facilityCode", label: "facilityCode" } },
    },
  },
  {
    id: "labContact",
    label: "Lab Contact",
    type: "dropdown",
    values: {
      $ref: { parent: "#/labContacts", map: { value: "labContactId", label: "cardName" } },
    },
  },
] as DynamicFormEntry[];
