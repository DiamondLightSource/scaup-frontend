import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";

// https://github.com/reduxjs/redux/issues/368
export const addToUnassignedClone = (unassigned: TreeData[], item: TreeData<BaseShipmentItem>) => {
  const newUnassigned = structuredClone(unassigned);
  newUnassigned[0].children![getCurrentStepIndex(item.data.type)].children!.push(item);
  return newUnassigned;
};

export const setInUnassignedClone = (
  unassigned: TreeData[],
  items: TreeData<BaseShipmentItem>[],
  type: string,
) => {
  const index = unassigned[0].children!.findIndex((item) => item.id === type);

  if (index !== -1) {
    unassigned[0].children![index].children = items;
  } else {
    throw Error("Invalid type provided");
  }

  return unassigned;
};
