import { GenericContainer } from "@/components/containers/Generic";
import { GridBox } from "@/components/containers/GridBox";
import { selectActiveItem, selectIsEdit } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, Step, separateDetails } from "@/mappings/pages";
import { Item } from "@/utils/client/item";
import { useRouter } from "next/navigation";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { TreeData } from "../visualisation/treeView";
import { Puck } from "@/components/containers/Puck";
import { Cane } from "@/components/containers/Cane";
import { RootParentType } from "@/types/generic";
import { useCallback } from "react";
import { CreationResponse } from "@/types/server";
import { StorageDewar } from "./StorageDewar";

export interface BaseContainerProps {
  /** Shipment ID */
  parentId: string;
  formContext?: UseFormReturn<BaseShipmentItem>;
  parentType?: RootParentType;
}

export interface ContainerProps extends BaseContainerProps {
  /** Container type */
  containerType: BaseShipmentItem["type"];
  containerSubType?: string;
}

export interface ChildLocationManagerProps {
  parentId: string;
  parent?: Step["endpoint"];
  child?: Step["endpoint"];
  /** Container creation data preset, used when creating new containers automatically */
  containerCreationPreset?: Record<string, any>;
  parentType?: RootParentType;
}

/**
 * Hook for managing a child's location in a parent container
 */
export const useChildLocationManager = ({
  parentId,
  parent = "containers",
  child = "containers",
  containerCreationPreset = {},
  parentType = "shipment",
}: ChildLocationManagerProps) => {
  const currentContainer = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
  const formContext = useFormContext();
  const router = useRouter();

  /**
   * Assign child to parent container server-side and update client representation
   *
   * @param containerId Parent container ID, or null if unassigning
   * @param childItem Child item
   * @param location Location, or null if not applicable
   */
  const setLocation = useCallback(
    async (
      containerId: TreeData["id"] | null,
      childItems: TreeData<BaseShipmentItem> | TreeData<BaseShipmentItem>[],
      location: number | null = null,
    ) => {
      const checkForm = formContext.handleSubmit(() => {});
      await checkForm();

      if (formContext.formState.errors && Object.keys(formContext.formState.errors).length > 0) {
        return;
      }

      const actualLocation = location !== null ? location + 1 : null;
      let actualContainerId = containerId;
      let newItem: null | CreationResponse = null;

      // There is no way of calling this callback if form context is undefined
      const values = separateDetails(formContext.getValues(), parent);

      // If container does not exist yet in database, we must create it
      if (!isEdit) {
        const receivedItem = await Item.create(
          parentId,
          { ...containerCreationPreset, ...values },
          parent,
          parentType,
        );

        if (!receivedItem) {
          return;
        }

        newItem = Array.isArray(receivedItem) ? receivedItem[0] : receivedItem;
        actualContainerId = newItem.id;
      } else {
        /*
         * If user has modified the parent container, and hasn't saved before assigning a position
         * to a child, we must update the container server-side first (AKA autosave)
         *
         * TODO: have some clever way of checking whether or not changes actually happened
         */
        Item.patch(
          currentContainer!.id,
          { ...currentContainer!.data, type: values.type, subType: values.subType },
          parent,
        );
      }

      let parentKey = "topLevelContainerId";

      if (parent === "containers") {
        if (child === "samples") {
          parentKey = "containerId";
        } else {
          parentKey = "parentId";
        }
      }

      const itemsToAssign = Array.isArray(childItems) ? childItems : [childItems];
      await Promise.all(
        itemsToAssign.map((item) =>
          Item.patch(
            item.id,
            {
              location: actualLocation,
              [parentKey]: actualContainerId,
            },
            child,
          ),
        ),
      );

      if (newItem) {
        if (parentType === "shipment") {
          router.replace(`../../${newItem.type}/${actualContainerId}/edit`, { scroll: false });
        } else {
          router.replace(`../${newItem.type}/${actualContainerId}`, { scroll: false });
        }
      }
    },
    [
      child,
      containerCreationPreset,
      currentContainer,
      formContext,
      isEdit,
      parent,
      parentId,
      parentType,
      router,
    ],
  );

  return setLocation;
};

export const Container = ({ containerType, ...props }: ContainerProps) => {
  switch (containerType) {
    case "gridBox":
      return <GridBox {...props} />;
    case "puck":
      return <Puck {...props} />;
    case "falconTube":
    case "genericContainer":
      return <GenericContainer {...props} />;
    case "cane":
      return <Cane {...props} />;
    case "dewar":
    case "walk-in":
      return <GenericContainer parent='topLevelContainers' child='containers' {...props} />;
    case "storageDewar":
      return <StorageDewar {...props} />;
    default:
      return null;
  }
};
