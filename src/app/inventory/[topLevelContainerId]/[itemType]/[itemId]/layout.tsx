import { ItemLayoutContent } from "./layoutContent";
import React from "react";
import { getShipmentData } from "@/utils/client/shipment";
import { TreeData } from "@/components/visualisation/treeView";
import { InventoryItemLayoutProps } from "@/types/generic";
import { VStack, Heading, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const ItemLayout = async (props: InventoryItemLayoutProps) => {
  const params = await props.params;

  const { children } = props;

  const shipmentData = (await getShipmentData(
    params.topLevelContainerId,
    "",
    "topLevelContainer",
  )) as TreeData;

  if (shipmentData === null) {
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
    <ItemLayoutContent params={params} shipmentData={shipmentData}>
      {children}
    </ItemLayoutContent>
  );
};

export default ItemLayout;
