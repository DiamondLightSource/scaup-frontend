import { BaseShipmentItem } from "@/mappings/pages";

export interface ItemFormPageContentProps {
  shipmentId: string;
  prepopData: Record<string, any>;
}

export interface ShipmentParams {
  proposalId: string;
  shipmentId: string;
}

export interface ItemParams extends ShipmentParams {
  itemId: string;
  itemType: BaseShipmentItem["type"];
}
