"use client";
import { ItemForm } from "@/components/input/form/ItemForm";
import {
  selectActiveItem,
  selectIsEdit,
  selectItems,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { getCurrentStepIndex, internalEbicSteps, separateDetails, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { InventoryItemParams } from "@/types/generic";
import { Item } from "@/utils/client/item";
import {
  Divider,
  Heading,
  HStack,
  Skeleton,
  Spacer,
  useToast,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export const ItemFormPageContent = ({ params }: { params: InventoryItemParams }) => {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(() => {
    if (params.itemType === "dewar") {
      return steps[steps.length - 1];
    }

    return internalEbicSteps[
      getCurrentStepIndex(activeItem ? activeItem.data.type : "sample", internalEbicSteps)
    ];
  }, [activeItem, params]);
  const router = useRouter();

  const activeIsEdit = useSelector(selectIsEdit);

  const currentShipment = useSelector(selectItems);

  useEffect(() => {
    dispatch(syncActiveItem({ id: Number(params.itemId), type: params.itemType }));
  }, [params, dispatch, currentShipment]);

  const onSubmit = useCallback(
    async (info: FieldValues) => {
      if (activeItem) {
        await Item.patch(
          activeItem.id,
          separateDetails(info, activeStep.endpoint),
          activeStep.endpoint,
        );

        toast({ title: "Successfully saved item!" });
        router.replace(`../${info.type}/${activeItem.id}`, { scroll: false });
      }
    },
    [toast, activeItem, params, router, activeStep],
  );

  if (!activeItem) {
    return (
      <VStack alignItems='stretch' h='100%' w='100%'>
        <Skeleton h='4em' />
        <Skeleton flex='1 0 0' />
        <Skeleton h='3.5em' />
      </VStack>
    );
  }

  if (activeItem && !activeIsEdit) {
    return (
      <VStack w='100%' py='2em'>
        <Heading variant='notFound'>No item selected</Heading>
        <Text>Select an item from the menu on the right</Text>
      </VStack>
    );
  }

  if (activeItem) {
    return (
      <VStack w='100%' h='100%' alignItems='start' gap='0'>
        <Heading size='md' color='gray.600'>
          {activeStep.singular}
        </Heading>
        <HStack w='100%'>
          <Heading>{activeItem.name}</Heading>
          <Spacer />
        </HStack>
        <Divider borderColor='gray.800' />
        <ItemForm
          parentType='topLevelContainer'
          parentId={params.topLevelContainerId}
          onSubmit={onSubmit}
        />
      </VStack>
    );
  }
};
