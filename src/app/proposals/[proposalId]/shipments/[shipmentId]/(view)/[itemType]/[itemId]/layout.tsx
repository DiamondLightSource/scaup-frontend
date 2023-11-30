import { BasePage, BaseShipmentItem } from "@/mappings/pages";
import ShipmentsLayoutContent from "./layoutContent";

export interface ItemParams {
  itemId: string;
  itemType: string;
}

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ItemParams;
}

const ShipmentsLayout = async ({ children, params }: ShipmentsLayoutProps) => {
  return (
    <ShipmentsLayoutContent
      itemId={params.itemId}
      itemType={params.itemType as BaseShipmentItem["type"]}
    >
      {children}
    </ShipmentsLayoutContent>
  );
};

export default ShipmentsLayout;
