"use client";
import { ItemForm } from "@/components/input/form/ItemForm";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  setNewActiveItem,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import {
  BaseShipmentItem,
  getCurrentStepIndex,
  internalEbicSteps,
  separateDetails,
} from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { InventoryItemParams } from "@/types/generic";
import { Item } from "@/utils/client/item";
import { Divider, Heading, HStack, Skeleton, Spacer, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export const ItemFormPageContent = ({ params }: { params: InventoryItemParams }) => {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () =>
      internalEbicSteps[
        getCurrentStepIndex(activeItem ? activeItem.data.type : "sample", internalEbicSteps)
      ],
    [activeItem],
  );
  const router = useRouter();

  const activeIsEdit = useSelector(selectIsEdit);

  useEffect(() => {
    if (params.itemId !== "new") {
      dispatch(syncActiveItem({ id: Number(params.itemId), type: params.itemType }));
    } else {
      dispatch(setNewActiveItem({ type: params.itemType, title: params.itemType }));
    }
  }, [params, dispatch]);

  const onSubmit = useCallback(
    async (info: FieldValues) => {
      if (!activeIsEdit && activeItem) {
        const values: TreeData<BaseShipmentItem> = {
          ...activeItem,
          data: { type: activeItem.data.type, ...info },
        };

        let newItem = await Item.create(
          params.topLevelContainerId,
          separateDetails(info, activeStep.endpoint),
          activeStep.endpoint,
          "topLevelContainer",
        );

        if (Array.isArray(newItem)) {
          newItem = newItem[0];
        }

        toast({ title: "Successfully created item!" });

        values.id = newItem.id;
        values.name = newItem.name ?? "";

        router.replace(`../${info.type}/${newItem.id}`, { scroll: false });
      } else {
        await Promise.all([
          Item.patch(
            activeItem!.id,
            separateDetails(info, activeStep.endpoint),
            activeStep.endpoint,
          ),
          dispatch(
            updateShipment({
              shipmentId: params.topLevelContainerId,
              parentType: "topLevelContainer",
            }),
          ),
          dispatch(
            updateUnassigned({
              shipmentId: params.topLevelContainerId,
              parentType: "topLevelContainer",
            }),
          ),
        ]);

        toast({ title: "Successfully saved item!" });
        router.replace(`../${info.type}/${activeItem!.id}`, { scroll: false });
      }
    },
    [dispatch, toast, activeItem, activeIsEdit, params, router, activeStep],
  );

  if (activeItem) {
    return (
      <VStack w='100%' h='100%' alignItems='start' gap='0'>
        <Heading size='md' color='gray.600'>
          {activeStep.singular}
        </Heading>
        <HStack w='100%'>
          <Heading>{activeIsEdit ? activeItem.name : `New ${activeStep.singular}`}</Heading>
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

  return (
    <VStack alignItems='stretch' h='100%' w='100%'>
      <Skeleton h='4em' />
      <Skeleton flex='1 0 0' />
      <Skeleton h='3.5em' />
    </VStack>
  );
};
