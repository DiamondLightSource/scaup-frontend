import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";

// https://github.com/reduxjs/redux/issues/368

/**
 * Add passed item to the list of unassigned items of the type of the passed item
 *
 * @param unassigned Unassigned item tree object
 * @param item Item to add
 * @returns Unassigned item tree with new item added
 */
export const addToUnassignedClone = (unassigned: TreeData[], item: TreeData<BaseShipmentItem>) => {
  const newUnassigned = structuredClone(unassigned);
  newUnassigned[0].children![getCurrentStepIndex(item.data.type)].children!.push(item);
  return newUnassigned;
};

/**
 * Set list of unassigned items of passed type to passed item list (in place)
 *
 * @param unassigned Unassigned item tree object to be modified
 * @param items List of unassigned items of a given type
 * @param type Type to search for in list of unassigned
 * @returns Copy of modified unassigned item tree with modifications
 */
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
