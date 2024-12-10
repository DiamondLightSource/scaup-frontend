import { Metadata } from "next";
import { ItemFormPageContent } from "./pageContent";
import { InventoryItemParams } from "@/types/generic";

export const metadata: Metadata = {
  title: "Edit Item - Scaup",
};

const ItemFormPage = async (props: { params: Promise<InventoryItemParams> }) => {
  const params = await props.params;
  return <ItemFormPageContent params={params} />;
};

export default ItemFormPage;
