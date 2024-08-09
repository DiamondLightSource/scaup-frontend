"use client";
import { ItemForm } from "@/components/input/form/ItemForm";
import { TreeData } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectIsEdit,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import {
  BaseShipmentItem,
  checkIsRoot,
  getCurrentStepIndex,
  separateDetails,
  steps,
} from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { ItemFormPageContentProps } from "@/types/generic";
import { Item } from "@/utils/client/item";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ItemFormPageContent = ({ shipmentId, prepopData }: ItemFormPageContentProps) => {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem ? activeItem.data.type : "sample")],
    [activeItem],
  );
  const router = useRouter();

  const activeIsEdit = useSelector(selectIsEdit);

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
          shipmentId,
          separateDetails(info, activeStep.endpoint),
          activeStep.endpoint,
        );

        if (Array.isArray(newItem)) {
          newItem = newItem[0];
        }

        values.id = newItem.id;
        values.name = newItem.name ?? "";

        if (checkIsRoot(values)) {
          await dispatch(updateShipment({ shipmentId }));
        } else {
          await dispatch(updateUnassigned({ shipmentId }));
        }

        toast({ title: "Successfully created item!" });
        router.replace(`../../${info.type}/${newItem.id}/edit`, { scroll: false });
      } else {
        await Promise.all([
          Item.patch(
            activeItem!.id,
            separateDetails(info, activeStep.endpoint),
            activeStep.endpoint,
          ),
          dispatch(updateShipment({ shipmentId })),
          dispatch(updateUnassigned({ shipmentId })),
        ]);

        toast({ title: "Successfully saved item!" });
        router.replace(`../../${info.type}/${activeItem!.id}/edit`, { scroll: false });
      }
    },
    [router, toast, dispatch, activeIsEdit, activeItem, shipmentId, activeStep],
  );

  return (
    <ItemForm
      parentId={shipmentId}
      parentType='shipment'
      prepopData={prepopData}
      onSubmit={onSubmit}
    />
  );
};

export default ItemFormPageContent;
