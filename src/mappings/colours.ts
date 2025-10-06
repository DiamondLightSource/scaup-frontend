import { components } from "@/types/schema";

export const VALID_SHIPMENT_STATUSES: Record<string, string> = {
  "at facility": "green",
  processing: "green",
  opened: "green",
  "awb created": "yellow",
  "sent to facility": "yellow",
  "Created": "yellow",
  "dispatch-requested": "purple",
  "pickup booked": "purple",
  "transfer-requested": "purple",
  "pickup cancelled": "red",
  "Draft": "gray"
};

export const getShipmentStatus = (shipment: components["schemas"]["ShipmentOut"]) => {
  if (shipment.status === null || shipment.status === undefined) {
    const creationStatus = shipment.externalId ? "Submitted" : "Draft";
    return {
      colour: creationStatus === "Submitted" ? "green" : "gray",
      statusText: creationStatus,
    };
  }

  return {
    colour: VALID_SHIPMENT_STATUSES[shipment.status] || "gray",
    statusText: shipment.status,
  };
};