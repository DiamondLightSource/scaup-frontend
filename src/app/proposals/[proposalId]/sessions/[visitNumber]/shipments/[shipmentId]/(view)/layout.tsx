import { UnassignedItemResponse } from "@/types/server";
import { getShipmentData } from "@/utils/server/shipment";
import ShipmentsLayoutContent from "./layoutContent";
import { redirect } from "next/navigation";
import { ShipmentLayoutProps } from "@/types/generic";

const ShipmentsLayout = async (props: ShipmentLayoutProps) => {
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
