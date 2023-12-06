import { BasePage } from "@/mappings/pages";
import { ItemParams } from "@/types/generic";
import ShipmentsLayoutContent from "./layoutContent";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ItemParams;
}

const ShipmentsLayout = async ({ children, params }: ShipmentsLayoutProps) => {
  return <ShipmentsLayoutContent params={params}>{children}</ShipmentsLayoutContent>;
};

export default ShipmentsLayout;
