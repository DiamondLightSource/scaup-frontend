"use client";
import {
  selectActiveItem,
  selectIsEdit,
  selectItems,
  setNewActiveItem,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Divider, HStack, Heading, Spacer, VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface ItemLayoutContentProps {
  itemId: string;
  itemType: BaseShipmentItem["type"];
  children: React.ReactNode;
}

const ItemLayoutContent = ({ itemType, itemId, children }: ItemLayoutContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const shipment = useSelector(selectItems);
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem ? activeItem.data.type : "sample")],
    [activeItem],
  );

  const activeIsEdit = useSelector(selectIsEdit);
  const formContext = useForm<BaseShipmentItem>();

  useEffect(() => {
    if (activeItem) {
      formContext.reset(activeItem.data, { keepValues: false, keepDefaultValues: false });
    }
  }, [formContext, activeItem, activeIsEdit]);

  useEffect(() => {
    if (shipment.length > 0) {
      if (itemId !== "new") {
        dispatch(syncActiveItem({ id: Number(itemId), type: itemType }));
      } else {
        dispatch(setNewActiveItem({ type: itemType, title: "lol" }));
      }
    }
  }, [itemId, itemType, dispatch, shipment]);

  if (!activeItem) {
    return null;
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
