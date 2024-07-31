import { BasePage } from "@/mappings/pages";
import { ItemParams } from "@/types/generic";
import { components } from "@/types/schema";
import { getShipmentData } from "@/utils/client/shipment";
import ShipmentsLayoutContent from "./layoutContent";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ItemParams;
}

const ShipmentsLayout = async ({ children, params }: ShipmentsLayoutProps) => {
  const data = await getShipmentData(params.shipmentId);
  const isBooked = data !== null && data.data.status === "Booked";

  return (
    <ShipmentsLayoutContent params={params} isBooked={isBooked}>
      {children}
    </ShipmentsLayoutContent>
  );
};

export default ShipmentsLayout;
