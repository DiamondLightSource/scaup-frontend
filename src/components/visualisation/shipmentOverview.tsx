import { TreeData, TreeView } from "@/components/visualisation/treeView";
import {
  selectActiveItem,
  selectItems,
  selectUnassigned,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, Step, getCurrentStepIndex, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { Item } from "@/utils/client/item";
import { Box, Divider, Heading, Skeleton, useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ShipmentOverviewInnerProps {
  onActiveChanged: (data: TreeData) => void;
  proposal: string;
  shipmentId: string;
  readOnly?: boolean;
}

const ShipmentOverview = ({
  proposal,
  shipmentId,
  onActiveChanged,
  readOnly = false,
}: ShipmentOverviewInnerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const unassigned = useSelector(selectUnassigned);
  const data = useSelector(selectItems);
  const activeItem = useSelector(selectActiveItem);
  const toast = useToast();

  const unassignItem = useCallback(
    async (item: TreeData<BaseShipmentItem>, endpoint: Step["endpoint"]) => {
      const body =
        endpoint === "samples"
          ? { containerId: null, location: null }
          : { topLevelContainerId: null, parentId: null, location: null };

      await Item.patch(item.id, body, endpoint);
      await Promise.all([
        dispatch(updateShipment({ shipmentId })),
        dispatch(updateUnassigned({ shipmentId })),
      ]);
      dispatch(syncActiveItem());
    },
    [dispatch, shipmentId],
  );

  const deleteItem = useCallback(
    async (item: TreeData<BaseShipmentItem>, endpoint: Step["endpoint"]) => {
      await Item.delete(item.id, endpoint);

      toast({ title: "Successfully removed item!" });

      if (endpoint === "topLevelContainers") {
        await dispatch(updateShipment({ shipmentId }));
      } else {
        await dispatch(updateUnassigned({ shipmentId }));
      }
      dispatch(syncActiveItem());
    },
    [shipmentId, dispatch, toast],
  );

  /** Remove item from assigned item list (or delete, if root item) */
  const handleUnassign = async (item: TreeData<BaseShipmentItem>) => {
    const endpoint = steps[getCurrentStepIndex(item.data.type)].endpoint;

    if (endpoint === "topLevelContainers") {
      deleteItem(item, endpoint);
    } else {
      unassignItem(item, endpoint);
    }
  };

  /** Delete item permanently */
  const handleDelete = useCallback(
    async (item: TreeData<BaseShipmentItem>) => {
      const endpoint = steps[getCurrentStepIndex(item.data.type)].endpoint;
      // TODO: type item object
      if (item.data.containerId || item.data.parentId || item.data.topLevelContainerId) {
        unassignItem(item, endpoint);
      } else {
        await deleteItem(item, endpoint);
      }
    },
    [unassignItem, deleteItem],
  );

  return (
    <>
      <Heading size='md' color='gray.600'>
        {proposal}
      </Heading>
      <Heading>Overview</Heading>
      <Divider borderColor='gray.800' />
      {data === null ? (
        <Skeleton flex='1 0 auto' w='100%' mt='10px' mb='20px' />
      ) : (
        <>
          <Box w='100%' flex='1 0 auto' mt='10px' mb='20px'>
            <TreeView
              readOnly={readOnly}
              flexGrow='1'
              data={data}
              onRemove={handleUnassign}
              onEdit={onActiveChanged}
              selectedItem={activeItem ?? undefined}
            />
          </Box>
          <TreeView
            readOnly={readOnly}
            mb='10px'
            w='100%'
            data={unassigned}
            onEdit={onActiveChanged}
            onRemove={handleDelete}
            selectedItem={activeItem ?? undefined}
          />
        </>
      )}
    </>
  );
};

export default ShipmentOverview;
