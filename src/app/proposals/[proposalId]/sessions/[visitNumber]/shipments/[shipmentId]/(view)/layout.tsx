import { BasePage } from "@/mappings/pages";
import { ShipmentParams } from "@/types/generic";
import { UnassignedItemResponse } from "@/types/server";
import { getShipmentData } from "@/utils/client/shipment";
import ShipmentsLayoutContent from "./layoutContent";
import { redirect } from "next/navigation";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: Promise<ShipmentParams>;
}

const ShipmentsLayout = async (props: ShipmentsLayoutProps) => {
  const params = await props.params;

  const { children } = props;

  const shipmentData = await getShipmentData(params.shipmentId);
  const unassignedItems = (await getShipmentData(
    params.shipmentId,
    "/unassigned",
  )) as UnassignedItemResponse | null;

  if (shipmentData === null || unassignedItems === null) {
    redirect("../..");
  }

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
