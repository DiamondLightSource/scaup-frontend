import { TreeData } from "@/components/visualisation/treeView";

export interface BasePage {
  activeStep: string;
}

export interface BaseShipmentItem {
  type: "sample" | "grid" | "gridBox" | "puck" | "falconTube" | "dewar";
  [x: string]: any;
}

export const steps = [
  { title: "Samples", id: "sample", singular: "Sample", endpoint: "samples" },
  { title: "Grid Boxes", id: "gridBox", singular: "Grid Box", endpoint: "containers" },
  {
    title: "Containers",
    id: ["puck", "falconTube"],
    singular: "Container",
    endpoint: "containers",
  },
  { title: "Dewars", id: "dewar", singular: "Dewar", endpoint: "dewars" },
];

export const pluralToSingular: Record<string, string> = {
  gridBoxes: "gridBox",
  samples: "sample",
  containers: "container",
  dewars: "dewar",
};

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
