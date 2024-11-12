import { BasePage } from "@/mappings/pages";
import { ItemParams } from "@/types/generic";
import { getShipmentData } from "@/utils/client/shipment";
import ShipmentsLayoutContent from "./layoutContent";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: Promise<ItemParams>;
}

const ShipmentsLayout = async (props: ShipmentsLayoutProps) => {
  const params = await props.params;

  const { children } = props;

  const data = await getShipmentData(params.shipmentId);
  const isBooked = data !== null && data.data.status === "Booked";

  return (
    <ShipmentsLayoutContent params={params} isBooked={isBooked}>
      {children}
    </ShipmentsLayoutContent>
  );
};

export default ShipmentsLayout;
