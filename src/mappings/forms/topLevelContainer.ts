import { DynamicFormEntry } from "@/components/input/form/input";
import { BaseShipmentItem } from "../pages";

export const topLevelContainerForm = [
  {
    id: "type",
    label: "Type",
    type: "dropdown",
    values: [
      { label: "Dewar", value: "dewar" },
      { label: "Walk-In", value: "walk-in" },
    ] as { label: string; value: BaseShipmentItem["type"] }[],
    watch: true,
  },
  {
    id: "comments",
    label: "Comments",
    type: "textarea",
  },
] as DynamicFormEntry[];
