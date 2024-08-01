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
  params: InventoryItemParams;
}

export interface BaseChildSelectorProps extends Omit<ModalProps, "children"> {
  /** Currently selected item for container position */
  selectedItem?: TreeData<PositionedItem> | null;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<BaseShipmentItem>) => Promise<void>;
  /** Callback for item removal event */
  onRemove?: (child: TreeData<PositionedItem>) => Promise<void>;
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
