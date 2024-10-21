import { TreeData, TreeView } from "@/components/visualisation/treeView";
import { selectActiveItem, selectItems, selectUnassigned } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, Step, getCurrentStepIndex, steps } from "@/mappings/pages";
import { Item } from "@/utils/client/item";
import { Box, Divider, Heading, Skeleton, useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export interface ShipmentOverviewInnerProps {
  onActiveChanged: (data: TreeData) => void;
  title: string;
  readOnly?: boolean;
}

export const ShipmentOverview = ({
  title,
  onActiveChanged,
  readOnly = false,
}: ShipmentOverviewInnerProps) => {
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
      toast({ title: "Successfully unassigned item!" });
    },
    [toast],
  );

  const deleteItem = useCallback(
    async (item: TreeData<BaseShipmentItem>, endpoint: Step["endpoint"]) => {
      await Item.delete(item.id, endpoint);
      toast({ title: "Successfully removed item!" });
    },
    [toast],
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
        {title}
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
