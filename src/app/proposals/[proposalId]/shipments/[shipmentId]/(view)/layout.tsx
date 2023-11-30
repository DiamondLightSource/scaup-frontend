import { TreeData } from "@/components/visualisation/treeView";
import { BasePage, BaseShipmentItem } from "@/mappings/pages";
import { UnassignedItemResponse } from "@/types/server";
import { getShipmentData } from "@/utils/client/shipment";
import ShipmentsLayoutContent, { ShipmentParams } from "./layoutContent";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ShipmentParams;
}

const ShipmentsLayout = async ({ children, params }: ShipmentsLayoutProps) => {
  // TODO: add type
  const shipmentData = (await getShipmentData(
    params.shipmentId,
  )) as TreeData<BaseShipmentItem> | null;
  const unassignedItems = (await getShipmentData(
    params.shipmentId,
    "/unassigned",
  )) as UnassignedItemResponse | null;

  return (
    <ShipmentsLayoutContent
      shipmentData={shipmentData}
      unassignedItems={unassignedItems}
      params={params}
    >
      {children}
    </ShipmentsLayoutContent>
  );
};

export default ShipmentsLayout;
