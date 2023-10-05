import { DynamicFormEntry } from "@/components/input/form/input";
import { BaseShipmentItem } from "../pages";

export const containerForm = [
  {
    id: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "type",
    label: "Type",
    type: "dropdown",
    values: [
      { label: "Falcon Tube", value: "falconTube" },
      { label: "Puck", value: "puck" },
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
