import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";

/** Recursively find item, its position in sibling array, and its siblings
 *
 * @param data Original tree object
 * @param key ID to search for
 * @param itemType Type of the item to search for
 * @param callback Callback function for when item is found
 */
export const recursiveFind = (
  data: TreeData[],
  key: string | number,
  itemType: BaseShipmentItem["type"],
  callback: (item: TreeData, index: number, siblings: TreeData<BaseShipmentItem>[]) => void,
) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.id === key && item.data.type == itemType) {
      return callback(item, i, data);
    }
    if (item.children && item.children.length > 0) {
      recursiveFind(item.children, key, itemType, callback);
    }
  }
};

/** Recursively count number of children of a given type
 *
 * @param data Original tree object
 * @param key Type to search for
 *
 * @returns Children count
 */
export const recursiveCountChildrenByType = (data: TreeData[], key: string | string[]) => {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.children) {
      if (Array.isArray(key) ? key.includes(item.data.type) : item.data.type === key) {
        count += item.children.length;
      } else {
        count += recursiveCountChildrenByType(item.children, key);
      }
    }
  }
  return count;
};

/**
 * Increment value in dictionary by passed value or add key/value pair to dictionary if it
 * does not exist already
 *
 * @param obj Source object
 * @param key Key to search/add
 * @param value Increment value
 */
const addOrSetObjectInPlace = (obj: Record<string, number>, key: string, value: number) => {
  if (key in obj) {
    obj[key] += value;
  } else {
    obj[key] = value;
  }
};

/**
 * Count instances of all types present in a tree data structure
 *
 * @param data Data to traverse
 * @returns Object mapping types to number of instances found
 */
export const recursiveCountTypeInstances = (data: TreeData<BaseShipmentItem>[]) => {
  const counts: Record<string, number> = {};

  for (const item of data) {
    addOrSetObjectInPlace(counts, item.data.type, 1);

    if (item.children) {
      const childCounts = recursiveCountTypeInstances(item.children);
      for (const [key, value] of Object.entries(childCounts)) {
        addOrSetObjectInPlace(counts, key, value);
      }
    }
  }

  return counts;
};

/** Recursively tag shipment items in place based on their position.
 *
 * @param data Original tree object
 */
export const setTagInPlace = (data: TreeData<BaseShipmentItem>[]) => {
  for (const item of data) {
    if (
      item.data !== undefined &&
      item.data.location !== undefined &&
      item.data.location !== null
    ) {
      item.tag = ((item.data.location as number) + 1).toString();
    }
    if (item.children !== undefined && item.children !== null) {
      setTagInPlace(item.children);
    }
  }
};

/**
 * Flatten tree items recursively. An additional "parent" parameter is added to the item's data.
 *
 * @param data Tree structure to flatten
 * @returns Flat array of tree items
 */
export const flattenTree = (data: TreeData<BaseShipmentItem>, parent: string | null = null) => {
  let flattenedTree: TreeData<BaseShipmentItem>[] = [
    { ...data, data: { ...data.data, parent }, children: undefined },
  ];

  if (data.children) {
    flattenedTree = flattenedTree.concat(
      data.children.flatMap((item) => flattenTree(item, data.name)),
    );
  }

  return flattenedTree;
};
