"use client";

import { ShipmentOverview } from "@/components/visualisation/ShipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import {
  defaultUnassigned,
  selectIsReview,
  setShipment,
  setUnassigned,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, pluralToSingular } from "@/mappings/pages";
import { ShipmentLayoutProps } from "@/types/generic";
import { UnassignedItemResponse } from "@/types/server";
import { Grid, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export interface ShipmentsLayoutContentProps {
  children: ShipmentLayoutProps["children"];
  params: Awaited<ShipmentLayoutProps["params"]>;
  shipmentData: TreeData<BaseShipmentItem>[] | null;
  unassignedItems: UnassignedItemResponse | null;
}

const ShipmentsLayoutContent = ({
  children,
  params,
  shipmentData,
  unassignedItems,
}: ShipmentsLayoutContentProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isReview = useSelector(selectIsReview);

  useEffect(() => {
    if (shipmentData) {
      dispatch(setShipment(shipmentData));
    }
    dispatch(syncActiveItem());
  }, [shipmentData, dispatch]);

  useEffect(() => {
    if (unassignedItems) {
      for (const [key, value] of Object.entries(unassignedItems)) {
        dispatch(setUnassigned({ items: value, type: pluralToSingular[key] }));
      }
    } else {
      for (const item of defaultUnassigned[0].children) {
        dispatch(setUnassigned({ items: item.children, type: item.id }));
      }
    }
    dispatch(syncActiveItem());
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
      {shipmentData && children}
      <VStack spacing='0' alignItems='start'>
        <ShipmentOverview
          readOnly={isReview}
          onActiveChanged={handleActiveChanged}
          title={`${params.proposalId}-${params.visitNumber}`}
        />
      </VStack>
    </Grid>
  );
};

export default ShipmentsLayoutContent;
