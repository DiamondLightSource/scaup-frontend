"use client";
import { ItemStepper, TypeCount } from "@/components/navigation/ItemStepper";
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
import { recursiveCountChildrenByType } from "@/utils/tree";
import {
  Button,
  Divider,
  GridItem,
  HStack,
  Heading,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ItemLayoutContentProps {
  isBooked?: boolean;
  children: React.ReactNode;
  params: ItemParams;
}

const ItemLayoutContent = ({ isBooked = false, children, params }: ItemLayoutContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const isReview = useSelector(selectIsReview);
  const activeItem = useSelector(selectActiveItem);
  const activeIsEdit = useSelector(selectIsEdit);

  const stepDescription = useMemo(() => steps[getCurrentStepIndex(params.itemType)], [params]);
  const activeStep = useMemo(() => getCurrentStepIndex(params.itemType), [params]);

  const [currentStep, setCurrentStep] = useState(0);
  const [hasUnassigned, setHasUnassigned] = useState(true);

  useEffect(() => {
    setCurrentStep(getCurrentStepIndex(params.itemType));
    if (params.itemId !== "new") {
      dispatch(syncActiveItem({ id: Number(params.itemId), type: params.itemType }));
    } else {
      dispatch(setNewActiveItem({ type: params.itemType, title: params.itemType }));
    }
  }, [params, dispatch]);

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
    [isReview, router],
  );

  /** Move to next shipment step */
  const handleContinue = useCallback(async () => {
    if (isReview) {
      router.push("../../pre-session");
      return;
    }
    if (activeStep + 1 < steps.length) {
      handleSetStep(activeStep + 1);
    } else {
      router.push("review");
    }
  }, [handleSetStep, activeStep, router, isReview]);

  const cannotFinish = useMemo(
    () =>
      activeStep >= steps.length - 1 && hasUnassigned,
    [activeStep, hasUnassigned],
  );

  const handleTypeCountChanged = useCallback((typeCount: TypeCount[]) => {
    setHasUnassigned(typeCount.some((count) => count.unassigned > 0))
  }, [])

  return (
    <>
      <GridItem flexBasis='fill' flexShrink='0' w='100%' area='stepper'>
        <ItemStepper steps={steps} onStepChanged={handleSetStep} onTypeCountChanged={handleTypeCountChanged} currentStep={currentStep}/>
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
            <Button
              onClick={() => router.back()}
              isDisabled={isBooked}
              pointerEvents={isBooked ? "none" : undefined}
            >
              Edit
            </Button>
          )}
          <Button onClick={handleContinue} bg='green.500' isDisabled={cannotFinish}>
            {isReview ? "Continue to Pre-Session Info" : "Continue"}
          </Button>
        </HStack>
      </GridItem>
    </>
  );
};

export default ItemLayoutContent;
