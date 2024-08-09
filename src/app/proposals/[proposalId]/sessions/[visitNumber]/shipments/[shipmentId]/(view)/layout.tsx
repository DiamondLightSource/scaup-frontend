import { BasePage } from "@/mappings/pages";
import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { UnassignedItemResponse } from "@/types/server";
import { getShipmentData } from "@/utils/client/shipment";
import ShipmentsLayoutContent from "./layoutContent";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ShipmentParams;
}

const ShipmentsLayout = async ({ children, params }: ShipmentsLayoutProps) => {
  const shipmentData = await getShipmentData(params.shipmentId);
  const unassignedItems = (await getShipmentData(
    params.shipmentId,
    "/unassigned",
  )) as UnassignedItemResponse | null;

  return (
    <ShipmentsLayoutContent
      shipmentData={shipmentData?.children}
      unassignedItems={unassignedItems}
      params={params}
    >
      {children}
    </ShipmentsLayoutContent>
  );
};

export default ShipmentsLayout;
