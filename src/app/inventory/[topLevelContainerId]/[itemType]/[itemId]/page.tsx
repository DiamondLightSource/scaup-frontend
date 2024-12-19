import { Metadata } from "next";
import { ItemFormPageContent } from "./pageContent";
import { InventoryItemParams } from "@/types/generic";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Item - Scaup",
};

const ItemFormPage = async (props: { params: Promise<InventoryItemParams> }) => {
  const params = await props.params;

  if (params.itemType === "storageDewar" && params.itemId === "new") {
    // Prevent users from accidentally creating dewar as child of storage dewar
    redirect(params.topLevelContainerId);
  }

  return <ItemFormPageContent params={params} />;
};

export default ItemFormPage;
