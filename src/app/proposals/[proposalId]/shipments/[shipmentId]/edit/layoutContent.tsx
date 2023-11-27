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
import { authenticatedFetch } from "@/utils/client";
import { recursiveCountChildrenByType } from "@/utils/tree";
import {
  Box,
  Button,
  Divider,
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  useEffect(() => {
    if (shipmentData && shipmentData.children) {
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
      if (step >= steps.length || activeStep >= steps.length) {
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
  const handleContinue = useCallback(async () => {
    if (activeStep + 1 < steps.length) {
      handleSetStep(activeStep + 1);
    } else if (activeStep + 1 === steps.length) {
      router.push("edit/review");
    } else {
      const response = await authenticatedFetch(`/shipments/${params.shipmentId}/push`, session, {
        method: "POST",
      });

      if (response && response.status === 200) {
        router.push("../submitted");
      }
    }
  }, [handleSetStep, activeStep, router, params, session]);

  const typeCount = useMemo(() => {
    const count: { total: number; unassigned: number }[] = Array.from(
      { length: steps.length },
      () => ({
        total: 0,
        unassigned: 0,
      }),
    );
    const unassignedItems: TreeData[] = unassigned[0].children!;

    if (shipment) {
      count[count.length - 1].total = shipment.length;

      for (let i = 1; i < steps.length; i++) {
        /*
         * Count assigned/unassigned items separetely, as there is no benefit of creating a
         * new object containing both
         */
        count[i - 1].total = recursiveCountChildrenByType(shipment, steps[i].id);
        count[i - 1].unassigned = recursiveCountChildrenByType(unassignedItems, steps[i].id);
        count[i - 1].total += count[i - 1].unassigned;
      }
    }

    // Count orphaned unassigned items directly, since they have no parent
    for (const i in unassignedItems) {
      if (unassignedItems[i].children !== undefined) {
        const unassignedCount = unassignedItems[i].children!.length;
        count[i].total += unassignedCount;
        count[i].unassigned += unassignedCount;
      }
    }
    return count;
  }, [shipment, unassigned]);

  const cannotFinish = useMemo(
    () => activeStep >= steps.length - 1 && typeCount.some((count) => count.unassigned > 0),
    [activeStep, typeCount],
  );

  return (
    <VStack h='100%' w='100%' mt='1em'>
      <Stepper colorScheme='green' index={activeStep} h='60px' w='100%'>
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
                {typeCount[index].total} {step.title}
              </StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Divider mb='10px' />
      <HStack alignItems='stretch' flex='1 0 0' w='100%' gap='2em' pb='20px'>
        {children}
        <VStack spacing='0' alignItems='start' w='45%'>
          <ShipmentOverview
            readOnly={activeStep >= steps.length}
            shipmentId={params.shipmentId}
            onActiveChanged={handleActiveChanged}
            proposal={params.proposalId}
          />
          <HStack w='100%' p='0.5em' bg='gray.200'>
            {cannotFinish && (
              <Text fontWeight='600' color='gray.600'>
                Cannot progress without assigning all items to a container!
              </Text>
            )}
            <Spacer />
            {activeStep >= steps.length && <Button onClick={handleEdit}>Edit</Button>}
            <Button onClick={handleContinue} bg='green.500' isDisabled={cannotFinish}>
              {activeStep < steps.length - 1 ? "Continue" : "Finish"}
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ShipmentsLayoutContent;
