import { DynamicFormEntry } from "@/components/input/form/input";

export const dewarForm = [
  {
    id: "barCode",
    label: "Barcode",
    type: "text",
  },
  {
    id: "code",
    label: "Dewar Code",
    type: "dropdown",
    values: {
      $ref: { parent: "#/dewars", map: { value: "dewarRegistryId", label: "facilityCode" } },
    },
  },
  {
    id: "labContact",
    label: "Lab Contact",
    type: "dropdown",
    values: {
      $ref: { parent: "#/labContacts", map: { value: "personId", label: "familyName" } },
    },
  },
] as DynamicFormEntry[];
