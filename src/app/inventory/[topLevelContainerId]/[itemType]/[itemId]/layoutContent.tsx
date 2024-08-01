"use client";
import { InventoryItemLayoutProps, InventoryItemParams } from "@/types/generic";
import React, { useCallback, useEffect, useState } from "react";
import { setShipment, setUnassigned } from "@/features/shipment/shipmentSlice";
import { internalEbicSteps, getCurrentStepIndex, BaseShipmentItem } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Divider, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ItemStepper } from "@/components/navigation/ItemStepper";
import { ShipmentOverview } from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { components } from "@/types/schema";

export interface InventoryItemLayoutContentProps extends InventoryItemLayoutProps {
  shipmentData: TreeData<BaseShipmentItem> | null;
  unassignedItems: components["schemas"]["Paged_GenericItem_"] | null;
}

export const ItemLayoutContent = ({
  children,
  shipmentData,
  unassignedItems,
  params,
}: InventoryItemLayoutContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(getCurrentStepIndex(params.itemType, internalEbicSteps));
  }, [params]);

  useEffect(() => {
    if (shipmentData) {
      dispatch(setShipment([shipmentData]));
    }
  }, [shipmentData, dispatch]);

  useEffect(() => {
    if (unassignedItems) {
      dispatch(setUnassigned({ items: unassignedItems.items, type: "container" }));
    } else {
      dispatch(setUnassigned({ items: [], type: "container" }));
    }
  }, [unassignedItems, dispatch]);

  const handleStepChanged = useCallback(
    (step: number) => {
      if (step >= internalEbicSteps.length) {
        return;
      }
      const currentStep = internalEbicSteps[step];

      const newType = (
        Array.isArray(currentStep.id) ? currentStep.id[0] : currentStep.id
      ) as BaseShipmentItem["type"];

      router.push(`../${newType}/new`);
    },
    [router],
  );

  const handleActiveChanged = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      router.push(`../${item.data.type}/${item.id}`);
    },
    [router],
  );

  return (
    <VStack w='100%' h='100%' alignItems='start'>
      <ItemStepper
        steps={internalEbicSteps}
        currentStep={currentStep}
        onStepChanged={handleStepChanged}
        width='100%'
      />
      <Divider />
      <HStack flex='1 0 0' w='100%' h='100%'>
        <VStack flex='2' gap='0' alignItems='start' h='100%'>
          {children}
        </VStack>
        <VStack height='100%' flex='1' alignItems='start' gap='0'>
          <ShipmentOverview
            title='Inventory'
            parentId={params.topLevelContainerId}
            parentType='topLevelContainer'
            onActiveChanged={handleActiveChanged}
          />
        </VStack>
      </HStack>
    </VStack>
  );
};
