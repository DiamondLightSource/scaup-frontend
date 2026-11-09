import { Metadata } from "next";
import { ItemFormPageContent } from "./pageContent";
import { InventoryItemParams } from "@/types/generic";
import { redirect } from "next/navigation";
import { serverFetch } from "@/utils/server/request";
import { components } from "@/types/schema";

export const metadata: Metadata = {
  title: "Edit Item - Scaup",
};

const getSlotOwnership = async (itemId: string | number) => {
  const response = await serverFetch(`/containers/${itemId}`);

  if (!response.ok) {
    return undefined;
  }

  const puck: components["schemas"]["ContainerOut"] = await response.json();

  return puck.slotOwnership;
};

const ItemFormPage = async (props: { params: Promise<InventoryItemParams> }) => {
  const { itemId, itemType, topLevelContainerId } = await props.params;

  if (itemType === "storageDewar" && itemId === "new") {
    // Prevent users from accidentally creating dewar as child of storage dewar
    redirect(topLevelContainerId);
  }

  const slotOwnership = itemType === "puck" ? await getSlotOwnership(itemId) : undefined;

  return (
    <ItemFormPageContent
      params={{ itemId, itemType, topLevelContainerId }}
      slotOwnership={slotOwnership}
    />
  );
};

export default ItemFormPage;
