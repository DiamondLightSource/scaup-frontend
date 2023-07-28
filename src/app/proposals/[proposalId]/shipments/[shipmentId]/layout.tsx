"use client";

import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectItems,
  selectUnassigned,
  setActiveItem,
  setShipment,
} from "@/features/shipment/shipmentSlice";
import { BasePage, BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import { recursiveCountChildrenByType, setTagInPlace } from "@/utils/tree";
import {
  Box,
  Button,
  HStack,
  Skeleton,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ShipmentParams {
  proposalId: string;
  shipmentId: string;
}

export interface ShipmentsLayoutProps {
  children: React.ReactElement<BasePage>;
  params: ShipmentParams;
}

const ShipmentsLayout = ({ children, params }: ShipmentsLayoutProps) => {
  const dispatch = useDispatch();

  const activeItem = useSelector(selectActiveItem);
  const shipment = useSelector(selectItems);
  const unassigned = useSelector(selectUnassigned);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // TODO: move this to async thunk
    if (params.shipmentId !== "new") {
      fetch(`/api/shipments/${params.shipmentId}`).then(async (response) => {
        const newShipment = await response.json();
        setTagInPlace(newShipment);
        dispatch(setShipment(newShipment));
      });
    }
  }, [params.shipmentId, dispatch]);

  useEffect(() => {
    setActiveStep(getCurrentStepIndex(activeItem.data.type));
  }, [activeItem]);

  /** Set empty active item with selected type */
  const handleSetStep = useCallback(
    (step: number) => {
      //router.push(`../${steps[step].id}/new`);
      const currentStep = steps[step];
      dispatch(
        setActiveItem({
          item: {
            id: `new-${currentStep.id}`,
            label: `New ${currentStep.title}`,
            data: {
              type: (Array.isArray(currentStep.id)
                ? currentStep.id[0]
                : currentStep.id) as BaseShipmentItem["type"],
            },
          },
          isEdit: false,
        }),
      );
    },
    [dispatch],
  );

  /** Set new active item */
  const handleActiveChanged = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      dispatch(setActiveItem({ item, isEdit: true }));
    },
    [dispatch],
  );

  /** Move to next shipment step */
  const handleContinue = useCallback(() => {
    if (activeStep + 1 < steps.length) {
      handleSetStep(activeStep + 1);
    } else {
      // TODO: handle finish
    }
  }, [handleSetStep, activeStep]);

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

  if (activeStep === undefined || shipment === undefined) {
    return (
      <VStack>
        <Skeleton w='100%' h='5vh' /> <Skeleton w='100%' h='40vh' />
      </VStack>
    );
  }

  return (
    <Box h='100%'>
      <Stepper index={activeStep} mb='15px' h='60px'>
        {steps.map((step, index) => (
          <Step aria-label={`${step.title} Step`} key={index} onClick={() => handleSetStep(index)}>
            <StepIndicator cursor='pointer' bg='white'>
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
          <ShipmentOverview onActiveChanged={handleActiveChanged} proposal={params.proposalId} />
          <HStack w='100%'>
            <Spacer />
            <Button onClick={handleContinue} bg='green.500'>
              {activeStep < steps.length - 1 ? "Continue" : "Finish"}
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default ShipmentsLayout;
