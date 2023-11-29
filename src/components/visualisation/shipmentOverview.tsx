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
import { Box, Divider, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  const unassignItem = useCallback(
    async (item: TreeData<BaseShipmentItem>, endpoint: Step["endpoint"]) => {
      const body =
        endpoint === "samples"
          ? { containerId: null, location: null }
          : { topLevelContainerId: null, parentId: null, location: null };

      await Item.patch(session, item.id, body, endpoint);
      await Promise.all([
        dispatch(updateShipment({ session, shipmentId })),
        dispatch(updateUnassigned({ session, shipmentId })),
      ]);
      dispatch(syncActiveItem());
    },
    [dispatch, session, shipmentId],
  );

  const deleteItem = useCallback(
    async (item: TreeData<BaseShipmentItem>, endpoint: Step["endpoint"]) => {
      await Item.delete(session, item.id, endpoint);
      if (endpoint === "topLevelContainers") {
        await dispatch(updateShipment({ session, shipmentId }));
      } else {
        await dispatch(updateUnassigned({ session, shipmentId }));
      }
      dispatch(syncActiveItem());
    },
    [session, shipmentId, dispatch],
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
      <Box w='100%' flex='1 0 auto' mt='10px' mb='20px'>
        <TreeView
          readOnly={readOnly}
          flexGrow='1'
          data={data}
          onRemove={handleUnassign}
          onEdit={onActiveChanged}
          selectedItem={activeItem}
        />
      </Box>
      <TreeView
        readOnly={readOnly}
        mb='10px'
        w='100%'
        data={unassigned}
        onEdit={onActiveChanged}
        onRemove={handleDelete}
        selectedItem={activeItem}
      />
    </>
  );
};

export default ShipmentOverview;
