import { DynamicFormEntry } from "@/components/input/form/input";
import { dewarForm } from "@/mappings/forms/dewar";
import { gridBoxForm } from "@/mappings/forms/gridBox";
import { puckForm } from "@/mappings/forms/puck";
import { sampleForm } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { containerForm } from "./container";

export const formMapping: Record<BaseShipmentItem["type"], DynamicFormEntry[]> = {
  sample: sampleForm,
  genericContainer: containerForm,
  puck: puckForm,
  falconTube: containerForm,
  dewar: dewarForm,
  grid: [],
  gridBox: gridBoxForm,
};
