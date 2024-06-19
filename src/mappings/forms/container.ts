import { DynamicFormEntry } from "@/components/input/form/input";
import { BaseShipmentItem } from "../pages";

export const containerForm = [
  {
    id: "name",
    label: "Name",
    hint: "Container name should match label/barcode",
    type: "text",
  },
  {
    id: "type",
    label: "Type",
    type: "dropdown",
    values: [
      { label: "Puck", value: "puck" },
      { label: "Falcon Tube", value: "falconTube" },
      { label: "Other", value: "genericContainer" },
    ] as { label: string; value: BaseShipmentItem["type"] }[],
    watch: true,
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
