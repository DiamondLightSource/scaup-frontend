import { TreeData } from "@/components/visualisation/treeView";
import { PositionedItem } from "@/mappings/forms/sample";
import { BaseShipmentItem } from "@/mappings/pages";
import { ModalProps } from "@chakra-ui/react";

export interface ItemFormPageContentProps {
  params: ItemParams;
  prepopData: Record<string, any>;
}

export type InventoryItemLayoutProps =
  LayoutProps<"/inventory/[topLevelContainerId]/[itemType]/[itemId]">;
export type ShipmentLayoutProps =
  LayoutProps<"/proposals/[proposalId]/sessions/[visitNumber]/shipments/[shipmentId]">;
export type ShipmentItemLayoutProps =
  LayoutProps<"/proposals/[proposalId]/sessions/[visitNumber]/shipments/[shipmentId]/[itemType]/[itemId]">;

export type ChildSelectorProps = MultipleChildSelectorProps | SingleChildSelectorProps;

export interface ItemDetails {
  label: string;
  value: string | number;
  /** Measurement unit to display for label */
  measurementUnit?: string;
}
export interface ItemWithDetails extends BaseShipmentItem {
  displayDetails?: ItemDetails[];
}

export interface MultipleChildSelectorProps extends BaseChildSelectorProps {
  /** Enable multiple children to be selected */
  acceptMultiple: true;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<ItemWithDetails>[]) => Promise<void>;
}

export interface SingleChildSelectorProps extends BaseChildSelectorProps {
  /** Enable multiple children to be selected */
  acceptMultiple?: false;
  /** Callback for item selection event */
  onSelect?: (child: TreeData<ItemWithDetails>) => Promise<void>;
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
  selectableChildren?: TreeData<ItemWithDetails>[];
  /** Whether to display child details (data of passed children) underneath child name*/
  displayDetails?: boolean;
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

export interface ContainerParams {
  containerId: number;
}

export type RootParentType = "shipment" | "topLevelContainer";
export interface ContainerItem {
  item?: TreeData<PositionedItem> | null;
  // X position for item in visual representation
  x: number;
  // Y position for item in visual representation
  y: number;
}
