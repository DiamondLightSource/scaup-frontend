import { ShipmentItemLayoutProps } from "@/types/generic";
import { getShipmentData } from "@/utils/server/shipment";
import ShipmentsLayoutContent from "./layoutContent";

const ShipmentsLayout = async (props: ShipmentItemLayoutProps) => {
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
