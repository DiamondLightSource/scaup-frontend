import { GenericContainer } from "@/components/containers/generic";
import { GridBox } from "@/components/containers/gridBox";
import {
  selectActiveItem,
  selectIsEdit,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, Step, separateDetails } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Item } from "@/utils/client/item";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { TreeData } from "../visualisation/treeView";
import { Puck } from "./puck";

export interface BaseContainerProps {
  /** Shipment ID */
  shipmentId: string;
  formContext?: UseFormReturn<BaseShipmentItem>;
}

export interface ContainerProps extends BaseContainerProps {
  /** Container type */
  containerType: BaseShipmentItem["type"];
}

export interface ChildLocationManagerProps {
  shipmentId: string;
  parent?: Step["endpoint"];
  child?: Step["endpoint"];
  /** Container creation data preset, used when creating new containers automatically */
  containerCreationPreset?: Record<string, any>;
}

/**
 * Hook for managing a child's location in a parent container
 */
export const useChildLocationManager = ({
  shipmentId,
  parent = "containers",
  child = "containers",
  containerCreationPreset = {},
}: ChildLocationManagerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentContainer = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
  const formContext = useFormContext();

  /**
   * Assign child to parent container server-side and update client representation
   *
   * @param containerId Parent container ID, or null if unassigning
   * @param childItem Child item
   * @param location Location, or null if not applicable
   */
  const setLocation = async (
    containerId: TreeData["id"] | null,
    childItem: TreeData<BaseShipmentItem>,
    location: number | null = null,
  ) => {
    let actualContainerId = containerId;

    // There is no way of calling this callback if form context is undefined
    const values = separateDetails(formContext.getValues(), parent);

    // If container does not exist yet in database, we must create it
    if (!isEdit) {
      const newItem = await Item.create(
        shipmentId,
        { ...containerCreationPreset, ...values },
        parent,
      );

      // TODO: type return of above properly
      actualContainerId = newItem.id as number;
    } else {
      /*
       * If user has modified the parent container, and hasn't saved before assigning a position
       * to a child, we must update the container server-side first (AKA autosave)
       *
       * TODO: have some clever way of checking whether or not changes actually happened
       */
      Item.patch(currentContainer!.id, { ...currentContainer!.data, type: values.type }, parent);
    }

    let parentKey = "topLevelContainerId";

    if (parent === "containers") {
      if (child === "samples") {
        parentKey = "containerId";
      } else {
        parentKey = "parentId";
      }
    }

    if (location !== null && currentContainer!.children) {
      const conflictingChild = currentContainer!.children.find(
        (item) => item.data.location === location,
      );

      if (conflictingChild) {
        await Item.patch(
          conflictingChild.id,
          {
            location: null,
            [parentKey]: null,
          },
          child,
        );
      }
    }

    await Item.patch(
      childItem.id,
      {
        location,
        [parentKey]: actualContainerId,
      },
      child,
    );

    await Promise.all([
      dispatch(updateShipment({ shipmentId })),
      dispatch(updateUnassigned({ shipmentId })),
    ]);

    dispatch(syncActiveItem({ id: actualContainerId ?? undefined, type: values.type }));
  };

  return setLocation;
};

/**
 * Grid box component. Should be used in conjunction with a field allowing the user to select
 * how many slots (capacity) the grid box should have, inside the parent form.
 */
export const Container = ({ containerType, ...props }: ContainerProps) => {
  switch (containerType) {
    case "gridBox":
      return <GridBox {...props} />;
    case "puck":
      return <Puck {...props} />;
    case "falconTube":
      return <GenericContainer {...props} />;
    case "genericContainer":
      return <GenericContainer {...props} />;
    case "dewar":
      return <GenericContainer parent='topLevelContainers' child='containers' {...props} />;
    default:
      return null;
  }
};
