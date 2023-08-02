import { TreeData } from "@/components/treeView";

export interface BasePage {
  activeStep: string;
}

export interface BaseShipmentItem {
  type: "sample" | "grid" | "gridBox" | "puck" | "falconTube" | "dewar";
  [x: string]: any;
}

export const steps = [
  { title: "Samples", id: "sample", singular: "Sample" },
  { title: "Grid Boxes", id: "gridBox", singular: "Grid Box" },
  { title: "Containers", id: ["puck", "falconTube"], singular: "Container" },
  { title: "Dewars", id: "dewar", singular: "Dewar" },
];

export const getCurrentStepIndex = (itemType: string) => {
  const currentIndex = steps.findIndex((step) => {
    if (Array.isArray(step.id)) {
      return step.id.includes(itemType);
    } else {
      return step.id === itemType;
    }
  });
  return currentIndex >= 0 ? currentIndex : 0;
};

/** Check if a given item is a root item */
export const checkIsRoot = (item: TreeData<BaseShipmentItem>) =>
  getCurrentStepIndex(item.data.type) === steps.length - 1;
