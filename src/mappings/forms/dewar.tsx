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
    values: "dewar.codes",
  },
  {
    id: "labContact",
    label: "Lab Contact",
    type: "dropdown",
    values: "proposal.labContacts",
  },
] as DynamicFormEntry[];
