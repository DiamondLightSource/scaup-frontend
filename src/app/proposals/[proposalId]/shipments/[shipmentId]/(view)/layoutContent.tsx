"use client";

import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { selectIsReview, setShipment, setUnassigned } from "@/features/shipment/shipmentSlice";
import { BasePage, BaseShipmentItem, pluralToSingular } from "@/mappings/pages";
import { ShipmentParams } from "@/types/generic";
import { UnassignedItemResponse } from "@/types/server";
import { Grid, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ShipmentParams;
  shipmentData: TreeData<BaseShipmentItem>[] | null;
  unassignedItems: UnassignedItemResponse | null;
}

const ShipmentsLayoutContent = ({
  children,
  params,
  shipmentData,
  unassignedItems,
}: ShipmentsLayoutProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isReview = useSelector(selectIsReview);

  useEffect(() => {
    if (shipmentData) {
      dispatch(setShipment(shipmentData));
    }
  }, [shipmentData, dispatch]);

  useEffect(() => {
    if (unassignedItems) {
      for (const [key, value] of Object.entries(unassignedItems)) {
        dispatch(setUnassigned({ items: value, type: pluralToSingular[key] }));
      }
    }
  }, [unassignedItems, dispatch]);

  /** Set new active item */
  const handleActiveChanged = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      router.push(`../../${item.data.type}/${item.id}/${isReview ? "review" : "edit"}`);
    },
    [router, isReview],
  );

  return (
    <Grid
      templateAreas={`"stepper stepper"
                      "item overview"
                      "item nav"`}
      templateColumns='2fr 1fr'
      templateRows='60px 1fr 3.5em'
      h='100%'
      w='100%'
      gap='1em'
    >
      {children}
      <VStack spacing='0' alignItems='start'>
        <ShipmentOverview
          readOnly={isReview}
          shipmentId={params.shipmentId}
          onActiveChanged={handleActiveChanged}
          proposal={params.proposalId}
        />
      </VStack>
    </Grid>
  );
};

export default ShipmentsLayoutContent;
