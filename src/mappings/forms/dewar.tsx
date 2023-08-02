import { DynamicFormEntry } from "@/components/input/formInput";
import { BaseShipmentItem } from "@/mappings/pages";

export interface PositionedItem extends BaseShipmentItem {
  position: number | null;
}

export const dewarForm = [
  {
    id: "barcode",
    label: "Barcode",
    type: "text",
  },
  {
    id: "dewarCode",
    label: "Dewar Code",
    type: "dropdown",
    values: {
      $ref: { parent: "#/dewar/codes", map: { value: "dewarId", label: "dewarCode" } },
    },
  },
  {
    id: "labContact",
    label: "Lab Contact",
    type: "dropdown",
    values: {
      $ref: { parent: "#/proposal/labContacts", map: { value: "dewarId", label: "dewarCode" } },
    },
  },
] as DynamicFormEntry[];
