"use client";
import {
  selectActiveItem,
  selectIsEdit,
  setNewActiveItem,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Divider, HStack, Heading, Skeleton, Spacer, VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ItemLayoutContentProps {
  itemId: string;
  itemType: BaseShipmentItem["type"];
  children: React.ReactNode;
}

const ItemLayoutContent = ({ itemType, itemId, children }: ItemLayoutContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem ? activeItem.data.type : "sample")],
    [activeItem],
  );

  const activeIsEdit = useSelector(selectIsEdit);

  useEffect(() => {
    if (itemId !== "new") {
      dispatch(syncActiveItem({ id: Number(itemId), type: itemType }));
    } else {
      dispatch(setNewActiveItem({ type: itemType, title: itemType }));
    }
  }, [itemId, itemType, dispatch]);

  if (!activeItem) {
    return (
      <VStack alignItems='stretch' w='65%'>
        <Skeleton h='4em' />
        <Skeleton flex='1 0 0' />
        <Skeleton h='3.5em' />
      </VStack>
    );
  }

  return (
    <VStack alignItems='stretch' w='65%'>
      <VStack spacing='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {activeStep.singular}
        </Heading>
        <HStack w='100%'>
          <Heading>{activeIsEdit ? activeItem.name : `New ${activeStep.singular}`}</Heading>
          <Spacer />
        </HStack>
        <Divider borderColor='gray.800' />
      </VStack>
      {children}
    </VStack>
  );
};

export default ItemLayoutContent;
