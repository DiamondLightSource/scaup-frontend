import { TreeData } from "@/components/visualisation/treeView";

export interface BasePage {
  activeStep: string;
}

export interface BaseShipmentItem {
  type: string;
  [x: string]: any;
}

export interface Step {
  title: string;
  id: BaseShipmentItem["type"] | BaseShipmentItem["type"][];
  singular: string;
  endpoint: "shipments" | "samples" | "containers" | "topLevelContainers";
}

export const steps: Step[] = [
  { title: "Samples", id: ["sample", "grid"], singular: "Sample", endpoint: "samples" },
  { title: "Grid Boxes", id: "gridBox", singular: "Grid Box", endpoint: "containers" },
  {
    title: "Containers",
    id: ["puck", "falconTube", "genericContainer"],
    singular: "Container",
    endpoint: "containers",
  },
  {
    title: "Packages",
    id: ["dewar", "walk-in"],
    singular: "Package",
    endpoint: "topLevelContainers",
  },
];

export const internalEbicSteps: Step[] = [
  { title: "Grid Boxes", id: "gridBox", singular: "Grid Box", endpoint: "containers" },
  {
    title: "Pucks",
    id: ["puck"],
    singular: "Puck",
    endpoint: "containers",
  },
  {
    title: "Canes",
    id: ["cane"],
    singular: "Cane",
    endpoint: "containers",
  },
  {
    title: "Dewars",
    id: ["dewar"],
    singular: "Dewar",
    endpoint: "topLevelContainers",
  },
];

export const pluralToSingular: Record<string, string> = {
  gridBoxes: "gridBox",
  samples: "sample",
  containers: "container",
  dewars: "dewar",
};

export const getCurrentStepIndex = (itemType: BaseShipmentItem["type"]) => {
  const currentIndex = steps.findIndex((step) => {
    if (Array.isArray(step.id)) {
      return step.id.includes(itemType);
    } else {
      return step.id === itemType;
    }
  });
  return currentIndex >= 0 ? currentIndex : 0;
};

/** Check if a given item is a root item (for example, a dewar, which cannot have any parents) */
export const checkIsRoot = (item: TreeData<BaseShipmentItem>) =>
  getCurrentStepIndex(item.data.type) === steps.length - 1;

const commonRootKeys = ["type", "name", "comments", "details", "shipmentId", "externalId"];

const rootKeyMap: Record<Step["endpoint"], string[]> = {
  containers: [
    ...commonRootKeys,
    "requestedReturn",
    "location",
    "parentId",
    "topLevelContainerId",
    "capacity",
    "registeredContainer",
  ],
  samples: [...commonRootKeys, "proteinId", "copies"],
  topLevelContainers: [...commonRootKeys, "code", "barCode", "status", "labContact"],
  shipments: [...commonRootKeys, "proposalReference"],
};

// TODO: type return properly, probably take in generic types
/**
 * Destructure flat object into request-safe object, placing all unrecognised values in details, whilst
 * other values are set in the root of the object
 *
 * @param info Raw object
 * @param endpoint Endpoint return value is meant for
 *
 * @returns API-compatible object
 */
export const separateDetails = (info: Record<string, any>, endpoint: Step["endpoint"]) => {
  const base: Record<string, any> = { details: info.details ?? ({} as Record<string, any>) };
  Object.entries(info).map(([key, val]) => {
    if (val !== null) {
      if (rootKeyMap[endpoint].includes(key)) {
        base[key] = val;
      } else {
        base.details[key] = val;
      }
    }
  });

  return base;
};
