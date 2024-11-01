import { authenticatedFetch } from "@/utils/client";
import { ItemLayoutContent } from "./layoutContent";
import React from "react";
import { getShipmentData } from "@/utils/client/shipment";
import { BaseShipmentItem } from "@/mappings/pages";
import { TreeData } from "@/components/visualisation/treeView";
import { components } from "@/types/schema";
import { InventoryItemLayoutProps } from "@/types/generic";
import { VStack, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const getUnassignedItems = async () => {
  const res = await authenticatedFetch.server("/internal-containers/unassigned", {
    next: { tags: ["shipment"] },
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

  if (shipmentData === null || unassignedItems === null) {
    return (
      <VStack w='100%' mt='3em'>
        <Heading variant='notFound'>Inventory Item Unavailable</Heading>
        <Text>This inventory item does not exist or you do not have permission to view it.</Text>
        <Link as={NextLink} href='..'>
          Return to inventory page
        </Link>
      </VStack>
    );
  }

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
