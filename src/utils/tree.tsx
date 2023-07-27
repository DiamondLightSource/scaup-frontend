import { TreeData } from "@/components/treeView";

export const recursiveFind = (
  data: TreeData[],
  key: string,
  callback: (item: TreeData, index: number, array: TreeData[]) => void,
) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.id === key) {
      return callback(item, i, data);
    }
    if (item.children !== undefined && item.children.length > 0) {
      recursiveFind(item.children, key, callback);
    }
  }
};

export const recursiveCountChildrenByType = (data: TreeData[], key: string | string[]) => {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.children !== undefined) {
      if (Array.isArray(key) ? key.includes(item.data.type) : item.data.type === key) {
        count += item.children.length;
      } else {
        count += recursiveCountChildrenByType(item.children, key);
      }
    }
  }
  return count;
};
