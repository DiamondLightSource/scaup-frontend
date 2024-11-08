"use client";
import { selectIsReview, selectItems, selectUnassigned } from "@/features/shipment/shipmentSlice";
import { Step } from "@/mappings/pages";
import { recursiveCountChildrenByType } from "@/utils/tree";
import {
  Stepper,
  Step as ChakraStep,
  HStack,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  StepTitle,
  StepDescription,
  StepSeparator,
  StepperProps,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { TreeData } from "../visualisation/treeView";

export interface TypeCount {
  total: number;
  unassigned: number;
}

export interface ItemStepperProps extends Omit<StepperProps, "children" | "index"> {
  /** Steps object containing description of available steps */
  steps: Step[];
  /** Current step */
  currentStep: number;
  /** Callback for when the current step changes */
  onStepChanged: (v: number) => void;
  /** Callback for when the amount of items per type changes */
  onTypeCountChanged?: (typeCount: TypeCount[]) => void;
}

export const ItemStepper = ({
  steps,
  onStepChanged,
  onTypeCountChanged,
  currentStep,
  ...props
}: ItemStepperProps) => {
  const isReview = useSelector(selectIsReview);
  const shipment = useSelector(selectItems);
  const unassigned = useSelector(selectUnassigned);

  const activeStep = useMemo(() => currentStep, [currentStep]);

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
      // If the last step is a top level container, include top level containers in the last step
      if (steps[steps.length - 1].endpoint === "topLevelContainers") {
        count[count.length - 1].total = shipment.length;
      }

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
  }, [shipment, unassigned, steps]);

  useEffect(() => {
    if (onTypeCountChanged) {
      onTypeCountChanged(typeCount);
    }
  }, [typeCount, onTypeCountChanged]);

  return (
    <Stepper colorScheme='green' h='60px' index={activeStep} {...props}>
      {steps.map((step, index) => (
        <ChakraStep key={index}>
          <HStack
            aria-label={`${step.title} Step`}
            onClick={() => onStepChanged(index)}
            style={{ cursor: isReview ? "not-allowed" : "pointer" }}
          >
            <StepIndicator bg='white'>
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
          </HStack>
          <StepSeparator />
        </ChakraStep>
      ))}
    </Stepper>
  );
};
