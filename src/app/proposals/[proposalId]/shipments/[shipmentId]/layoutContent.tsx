"use client";

import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectItems,
  selectStep,
  selectUnassigned,
  setActiveItem,
  setNewActiveItem,
  setShipment,
  setStep,
  setUnassigned,
} from "@/features/shipment/shipmentSlice";
import {
  BasePage,
  BaseShipmentItem,
  getCurrentStepIndex,
  pluralToSingular,
  steps,
} from "@/mappings/pages";
import { UnassignedItemResponse } from "@/types/server";
import { recursiveCountChildrenByType, setTagInPlace } from "@/utils/tree";
import {
  Box,
  Button,
  HStack,
  Spacer,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ShipmentParams {
  proposalId: string;
  shipmentId: string;
}

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ShipmentParams;
  shipmentData: TreeData<BaseShipmentItem> | null;
  // TODO: use type from server
  unassignedItems: UnassignedItemResponse | null;
}

const ShipmentsLayoutContent = ({
  children,
  params,
  shipmentData,
  unassignedItems,
}: ShipmentsLayoutProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (shipmentData && shipmentData.children) {
      setTagInPlace(shipmentData.children);
      dispatch(setShipment(shipmentData.children));
    }
  }, [shipmentData, dispatch]);

  useEffect(() => {
    if (unassignedItems) {
      for (const [key, value] of Object.entries(unassignedItems)) {
        dispatch(setUnassigned({ items: value, type: pluralToSingular[key] }));
      }
    }
  }, [unassignedItems, dispatch]);

  const router = useRouter();
  const activeItem = useSelector(selectActiveItem);
  const shipment = useSelector(selectItems);
  const unassigned = useSelector(selectUnassigned);
  const activeStep = useSelector(selectStep);

  useEffect(() => {
    if (activeStep >= steps.length) {
      return;
    }

    dispatch(setStep(getCurrentStepIndex(activeItem.data.type)));
  }, [activeItem, dispatch, activeStep]);

  /** Set empty active item with selected type */
  const handleSetStep = useCallback(
    (step: number) => {
      if (activeStep >= steps.length) {
        return;
      }
      const currentStep = steps[step];

      const newType = (
        Array.isArray(currentStep.id) ? currentStep.id[0] : currentStep.id
      ) as BaseShipmentItem["type"];

      dispatch(setNewActiveItem({ type: newType, title: currentStep.title }));
    },
    [dispatch, activeStep],
  );

  /** Set new active item */
  const handleActiveChanged = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      dispatch(setActiveItem({ item, isEdit: true }));
    },
    [dispatch],
  );

  const handleEdit = useCallback(() => {
    dispatch(setStep(0));
    router.back();
  }, [router, dispatch]);

  /** Move to next shipment step */
  const handleContinue = useCallback(() => {
    if (activeStep + 1 < steps.length) {
      handleSetStep(activeStep + 1);
    } else {
      router.push(`${params.shipmentId}/review`);
    }
  }, [handleSetStep, activeStep, router, params]);

  const typeCount = useMemo(() => {
    const count = Array<number>(steps.length).fill(0);

    if (shipment) {
      count[count.length - 1] = shipment.length;

      for (let i = 1; i < steps.length; i++) {
        count[i - 1] = recursiveCountChildrenByType(shipment, steps[i].id);
      }
    }

    const unassignedItems: TreeData[] = unassigned[0].children!;
    for (const i in unassignedItems) {
      if (unassignedItems[i].children !== undefined) {
        count[i] += unassignedItems[i].children!.length;
      }
    }
    return count;
  }, [shipment, unassigned]);

  return (
    <Box h='100%'>
      <Stepper index={activeStep} mb='15px' h='60px'>
        {steps.map((step, index) => (
          <Step aria-label={`${step.title} Step`} key={index} onClick={() => handleSetStep(index)}>
            <StepIndicator
              cursor={activeStep > steps.length ? "not-allowed" : "pointer"}
              bg='white'
            >
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>
                {typeCount[index]} {step.title}
              </StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <HStack alignItems='start' h='80%'>
        {children}
        <VStack spacing='0' alignItems='start' w='45%' h='100%'>
          <ShipmentOverview
            shipmentId={params.shipmentId}
            onActiveChanged={handleActiveChanged}
            proposal={params.proposalId}
          />
          <HStack w='100%'>
            <Spacer />
            {activeStep >= steps.length && <Button onClick={handleEdit}>Edit</Button>}
            <Button onClick={handleContinue} bg='green.500'>
              {activeStep < steps.length - 1 ? "Continue" : "Finish"}
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default ShipmentsLayoutContent;
