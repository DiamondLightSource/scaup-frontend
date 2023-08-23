import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";

export interface UnassignedItemResponse {
  samples: TreeData<BaseShipmentItem>[];
  containers: TreeData<BaseShipmentItem>[];
  gridBoxes: TreeData<BaseShipmentItem>[];
}
