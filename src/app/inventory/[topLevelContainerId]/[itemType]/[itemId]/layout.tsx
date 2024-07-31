import { authenticatedFetch } from "@/utils/client";
import ItemLayoutContent, { InventoryItemLayoutProps } from "./layoutContent";
import React from "react";
import { getShipmentData } from "@/utils/client/shipment";
import { BaseShipmentItem } from "@/mappings/pages";
import { TreeData } from "@/components/visualisation/treeView";
import { components } from "@/types/schema";

const getUnassignedItems = async () => {
  const res = await authenticatedFetch.server("/internal-containers/unassigned", {
    cache: "no-store",
  });

  return res && res.status === 200
    ? ((await res.json()) as components["schemas"]["Paged_GenericItem_"])
    : null;
};

const ItemLayout = async ({ children, params }: InventoryItemLayoutProps) => {
  const shipmentData = (await getShipmentData(
    params.topLevelContainerId,
    "",
    "topLevelContainer",
  )) as TreeData<BaseShipmentItem>;

  const unassignedItems = await getUnassignedItems();

  return (
    <ItemLayoutContent
      params={params}
      shipmentData={shipmentData}
      unassignedItems={unassignedItems}
    >
      {children}
    </ItemLayoutContent>
  );
};

export default ItemLayout;
