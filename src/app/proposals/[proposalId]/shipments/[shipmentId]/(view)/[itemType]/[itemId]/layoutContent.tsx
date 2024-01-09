"use client";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  selectIsReview,
  selectItems,
  selectUnassigned,
  setNewActiveItem,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { ItemParams } from "@/types/generic";
import { authenticatedFetch } from "@/utils/client";
import { recursiveCountChildrenByType } from "@/utils/tree";
import {
  Box,
  Button,
  Divider,
  GridItem,
  HStack,
  Heading,
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
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ItemLayoutContentProps {
  children: React.ReactNode;
  params: ItemParams;
}

const ItemLayoutContent = ({ children, params }: ItemLayoutContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const isReview = useSelector(selectIsReview);
  const activeItem = useSelector(selectActiveItem);
  const shipment = useSelector(selectItems);
  const unassigned = useSelector(selectUnassigned);

  const stepDescription = useMemo(() => steps[getCurrentStepIndex(params.itemType)], [params]);

  const activeIsEdit = useSelector(selectIsEdit);

  const activeStep = useMemo(() => getCurrentStepIndex(params.itemType), [params]);

  useEffect(() => {
    if (params.itemId !== "new") {
      dispatch(syncActiveItem({ id: Number(params.itemId), type: params.itemType }));
    } else {
      dispatch(setNewActiveItem({ type: params.itemType, title: params.itemType }));
    }
  }, [params, dispatch]);

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

  /** Set empty active item with selected type */
  const handleSetStep = useCallback(
    (step: number) => {
      if (step >= steps.length || isReview) {
        return;
      }
      const currentStep = steps[step];

      const newType = (
        Array.isArray(currentStep.id) ? currentStep.id[0] : currentStep.id
      ) as BaseShipmentItem["type"];

      router.push(`../../${newType}/new/edit`);
    },
    [router, isReview],
  );

  /** Move to next shipment step */
  const handleContinue = useCallback(async () => {
    if (isReview) {
      const response = await authenticatedFetch(`/shipments/${params.shipmentId}/push`, session, {
        method: "POST",
      });

      if (response && response.status === 200) {
        router.push("../../submitted");
        return;
      } else {
        toast({ description: "Could not update items! Please try again later", status: "error" });
      }
    }
    if (activeStep + 1 < steps.length) {
      handleSetStep(activeStep + 1);
    } else {
      router.push("review");
    }
  }, [handleSetStep, activeStep, router, params, session, toast, isReview]);

  const cannotFinish = useMemo(
    () =>
      activeStep >= steps.length - 1 &&
      (typeCount.some((count) => count.unassigned > 0) || shipment === null),
    [activeStep, typeCount, shipment],
  );

  return (
    <>
      <GridItem flexBasis='fill' flexShrink='0' w='100%' area='stepper'>
        <Stepper colorScheme='green' h='60px' index={activeStep}>
          {steps.map((step, index) => (
            <Step
              aria-label={`${step.title} Step`}
              key={index}
              onClick={() => handleSetStep(index)}
            >
              <StepIndicator cursor={isReview ? "not-allowed" : "pointer"} bg='white'>
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
      </GridItem>

      <GridItem area='item'>
        {activeItem ? (
          <VStack spacing='0' alignItems='start' w='100%' h='100%'>
            <Heading size='md' color='gray.600'>
              {stepDescription.singular}
            </Heading>
            <HStack w='100%'>
              <Heading>
                {activeIsEdit ? activeItem.name : `New ${stepDescription.singular}`}
              </Heading>
              <Spacer />
            </HStack>
            <Divider borderColor='gray.800' />
            {children}
          </VStack>
        ) : (
          <VStack alignItems='stretch' h='100%'>
            <Skeleton h='4em' />
            <Skeleton flex='1 0 0' />
            <Skeleton h='3.5em' />
          </VStack>
        )}
      </GridItem>

      <GridItem area='nav'>
        <HStack h='100%' px='1em' bg='gray.200'>
          {cannotFinish && (
            <Text fontWeight='600' color='gray.600'>
              Cannot progress without assigning all items to a container!
            </Text>
          )}
          <Spacer />
          {isReview && (
            <Button as={Link} href='edit'>
              Edit
            </Button>
          )}
          <Button onClick={handleContinue} bg='green.500' isDisabled={cannotFinish}>
            {activeStep < steps.length - 1 && !isReview ? "Continue" : "Finish"}
          </Button>
        </HStack>
      </GridItem>
    </>
  );
};

export default ItemLayoutContent;
