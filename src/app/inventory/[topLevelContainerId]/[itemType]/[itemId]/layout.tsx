import { serverFetch } from "@/utils/server/request";
import { ItemLayoutContent } from "./layoutContent";
import React from "react";
import { getShipmentData } from "@/utils/server/shipment";
import { TreeData } from "@/components/visualisation/treeView";
import { components } from "@/types/schema";
import { InventoryItemLayoutProps } from "@/types/generic";
import { VStack, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const getUnassignedItems = async () => {
  const res = await serverFetch("/internal-containers/unassigned", {
    cache: "force-cache",
    next: { tags: ["shipment"] },
  });

  return res && res.status === 200
    ? ((await res.json()) as components["schemas"]["Paged_GenericItem_"])
    : null;
};

const ItemLayout = async (props: InventoryItemLayoutProps) => {
  const params = await props.params;

  const { children } = props;

  const shipmentData = (await getShipmentData(
    params.topLevelContainerId,
    "",
    "topLevelContainer",
  )) as TreeData;

  const unassignedItems = await getUnassignedItems();

  if (shipmentData === null || unassignedItems === null) {
    return (
      <VStack w='100%' mt='3em'>
        <Heading variant='notFound'>Inventory Item Unavailable</Heading>
        <Text>This inventory item does not exist or you do not have permission to view it.</Text>
        <NextLink href='..'>
          Return to inventory page
        </NextLink>
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
