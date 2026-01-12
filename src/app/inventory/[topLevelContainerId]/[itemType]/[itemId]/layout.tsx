import { ItemLayoutContent } from "./layoutContent";
import { getShipmentData } from "@/utils/server/shipment";
import { TreeData } from "@/components/visualisation/treeView";
import { InventoryItemLayoutProps } from "@/types/generic";
import { VStack, Heading, Text } from "@chakra-ui/react";
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
        <NextLink href='..'>Return to inventory page</NextLink>
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
