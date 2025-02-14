import { TreeData } from "@/components/visualisation/treeView";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { ModalProps } from "@chakra-ui/react";

export interface ItemFormPageContentProps {
  shipmentId: string;
  prepopData: Record<string, any>;
}

export interface InventoryItemLayoutProps {
  children: React.ReactElement;
  params: Promise<InventoryItemParams>;
}

export type ChildSelectorProps = MultipleChildSelectorProps | SingleChildSelectorProps;

export interface MultipleChildSelectorProps extends BaseChildSelectorProps {
  /** Enable multiple children to be selected */
  acceptMultiple: true;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<BaseShipmentItem>[]) => Promise<void>;
}

export interface SingleChildSelectorProps extends BaseChildSelectorProps {
  /** Enable multiple children to be selected */
  acceptMultiple?: false;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<BaseShipmentItem>) => Promise<void>;
}

export interface BaseChildSelectorProps extends Omit<ModalProps, "children"> {
  /** Currently selected item for container position */
  selectedItem?: TreeData<PositionedItem> | null;
  /** Callback for item removal event */
  onRemove?: (child: TreeData<PositionedItem>) => Promise<void>;
  /** Type of container's children */
  childrenType: BaseShipmentItem["type"];
  /** Disable editing controls */
  readOnly?: boolean;
  /** Selectable children. If not provided, unassigned items are used */
  selectableChildren?: TreeData[];
}

export interface SessionParams {
  proposalId: string;
  visitNumber: string;
}

export interface ShipmentParams extends SessionParams {
  shipmentId: string;
}

export interface ItemParams extends ShipmentParams {
  itemId: string;
  itemType: BaseShipmentItem["type"];
}

export interface InventoryItemParams {
  itemType: string;
  itemId: string;
  topLevelContainerId: string;
}

export type RootParentType = "shipment" | "topLevelContainer";
export interface ContainerItem {
  item?: TreeData<PositionedItem> | null;
  // X position for item in visual representation
  x: number;
  // Y position for item in visual representation
  y: number;
}
