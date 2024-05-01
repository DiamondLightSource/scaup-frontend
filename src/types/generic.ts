import { BaseShipmentItem } from "@/mappings/pages";

export interface ItemFormPageContentProps {
  shipmentId: string;
  prepopData: Record<string, any>;
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
