"use client";
import { InventoryItemLayoutProps } from "@/types/generic";
import { useCallback, useEffect, useState } from "react";
import { setShipment } from "@/features/shipment/shipmentSlice";
import { internalEbicSteps, getCurrentStepIndex, BaseShipmentItem } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Divider, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ItemStepper } from "@/components/navigation/ItemStepper";
import { ShipmentOverview } from "@/components/visualisation/ShipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";

export interface InventoryItemLayoutContentProps {
  shipmentData: TreeData<BaseShipmentItem> | null;
  children: InventoryItemLayoutProps["children"];
  params: Awaited<InventoryItemLayoutProps["params"]>;
}

export const ItemLayoutContent = ({
  children,
  shipmentData,
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

  const handleActiveChanged = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      router.push(`../${item.data.type}/${item.id}`);
    },
    [router],
  );

  return (
    <VStack w='100%' h='100%' alignItems='start'>
      <ItemStepper steps={internalEbicSteps} currentStep={currentStep} width='100%' />
      <Divider />
      <HStack flex='1 0 0' w='100%' h='100%'>
        <VStack flex='2' gap='0' alignItems='start' h='100%'>
          {children}
        </VStack>
        <VStack height='100%' flex='1' alignItems='start' gap='0'>
          <ShipmentOverview
            title='Inventory'
            onActiveChanged={handleActiveChanged}
            readOnly={true}
            hideUnassigned={true}
            startCollapsed={true}
          />
        </VStack>
      </HStack>
    </VStack>
  );
};
