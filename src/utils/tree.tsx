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
  key: string,
  itemType: BaseShipmentItem["type"],
  callback: (item: TreeData, index: number, siblings: TreeData<BaseShipmentItem>[]) => void,
) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.id === key && item.data.type == itemType) {
      return callback(item, i, data);
    }
    if (item.children !== undefined && item.children.length > 0) {
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

/** Recursively tag shipment items in place based on their position.
 *
 * @param data Original tree object
 */
export const setTagInPlace = (data: TreeData<BaseShipmentItem>[]) => {
  for (const item of data) {
    if (item.data !== undefined && item.data.position !== undefined) {
      item.tag = ((item.data.position as number) + 1).toString();
    }
    if (item.children !== undefined && item.children !== null) {
      setTagInPlace(item.children);
    }
  }
};
