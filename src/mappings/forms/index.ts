import { DynamicFormEntry } from "@/types/forms";
import { containerForm } from "@/mappings/forms/container";
import { dewarForm } from "@/mappings/forms/dewar";
import { gridBoxForm } from "@/mappings/forms/gridBox";
import { preSessionForm } from "@/mappings/forms/preSession";
import { puckForm } from "@/mappings/forms/puck";
import { sampleForm } from "@/mappings/forms/sample";
import { walkInForm } from "@/mappings/forms/walkIn";
import { BaseShipmentItem } from "@/mappings/pages";
import { caneForm } from "@/mappings/forms/cane";

export const formMapping: Record<BaseShipmentItem["type"], DynamicFormEntry[]> = {
  sample: sampleForm,
  grid: sampleForm,
  genericContainer: containerForm,
  puck: puckForm,
  falconTube: containerForm,
  dewar: dewarForm,
  "walk-in": walkInForm,
  gridBox: gridBoxForm,
  preSession: preSessionForm,
  cane: caneForm,
  shipment: [],
};
