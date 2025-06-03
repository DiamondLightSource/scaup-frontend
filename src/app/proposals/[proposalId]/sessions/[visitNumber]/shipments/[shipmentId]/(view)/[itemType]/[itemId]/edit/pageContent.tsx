"use client";
import { ItemForm } from "@/components/input/form/ItemForm";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  selectItems,
  setNewActiveItem,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex, separateDetails, steps } from "@/mappings/pages";
import { ItemFormPageContentProps } from "@/types/generic";
import { Item } from "@/utils/client/item";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ItemFormPageContent = ({ params, prepopData }: ItemFormPageContentProps) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const activeItem = useSelector(selectActiveItem);
  const activeShipment = useSelector(selectItems);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem ? activeItem.data.type : "sample")],
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
  }, [dispatch, params.itemId, params.itemType, activeShipment]);
  // Keep activeShipment as a dependency - in case the shipment is updated by something else

  const onSubmit = useCallback(
    async (info: FieldValues) => {
      if (!activeIsEdit && activeItem) {
        // Temporary measure, at least whilst all samples are in grids
        if (info.type === "sample") {
          info.type = "grid";
        }

        const values: TreeData<BaseShipmentItem> = {
          ...activeItem,
          data: { type: activeItem.data.type, ...info },
        };

        let newItem = await Item.create(
          params.shipmentId,
          separateDetails(info, activeStep.endpoint),
          activeStep.endpoint,
        );

        if (Array.isArray(newItem)) {
          newItem = newItem[0];
        }

        values.id = newItem.id;
        values.name = newItem.name ?? "";

        toast({ title: "Successfully created item!" });
        router.replace(`../../${info.type}/${newItem.id}/edit`, { scroll: false });
      } else {
        await Item.patch(
          activeItem!.id,
          separateDetails(info, activeStep.endpoint),
          activeStep.endpoint,
        );

        toast({ title: "Successfully saved item!" });
        router.replace(`../../${info.type}/${activeItem!.id}/edit`, { scroll: false });
      }
    },
    [router, toast, activeIsEdit, activeItem, params.shipmentId, activeStep],
  );

  return (
    <ItemForm
      parentId={params.shipmentId}
      parentType='shipment'
      prepopData={prepopData}
      onSubmit={onSubmit}
    />
  );
};

export default ItemFormPageContent;
