import { Metadata } from "next";
import ItemFormPageContent from "./pageContent";
import { InventoryItemParams } from "@/types/generic";

export const metadata: Metadata = {
  title: "Edit Item - Sample Handling",
};

const ItemFormPage = async ({ params }: { params: InventoryItemParams }) => {
  return <ItemFormPageContent params={params} />;
};

export default ItemFormPage;
