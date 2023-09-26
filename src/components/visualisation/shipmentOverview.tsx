import { TreeData, TreeView } from "@/components/visualisation/treeView";
import {
  selectItems,
  selectUnassigned,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex, steps } from "@/mappings/pages";
import { AppDispatch } from "@/store";
import { authenticatedFetch } from "@/utils/client";
import { Box, Divider, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface ShipmentOverviewInnerProps {
  onActiveChanged: (data: TreeData) => void;
  proposal: string;
  shipmentId: string;
}

const ShipmentOverview = ({
  proposal,
  shipmentId,
  onActiveChanged,
}: ShipmentOverviewInnerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const unassigned = useSelector(selectUnassigned);
  const data = useSelector(selectItems);
  const { data: session } = useSession();

  /** Remove item from assigned item list (or delete, if root item) */
  const handleRemove = (item: TreeData<BaseShipmentItem>) => {
    const endpoint = steps[getCurrentStepIndex(item.data.type)].endpoint;

    if (endpoint === "topLevelContainers") {
      handleDelete(item);
      dispatch(updateShipment({ session, shipmentId }));
    } else {
      const body =
        endpoint === "samples"
          ? { containerId: null }
          : { topLevelContainerId: null, parentId: null };

      authenticatedFetch
        .client(`/shipments/${shipmentId}/${endpoint}/${item.id}`, session, {
          method: "PATCH",
          body: JSON.stringify(body),
        })
        .then((response) => {
          if (response && response.status === 200) {
            dispatch(updateShipment({ session, shipmentId }));
            dispatch(updateUnassigned({ session, shipmentId }));
          }
        });
    }
  };

  /** Delete item permanently */
  const handleDelete = useCallback(
    (item: TreeData<BaseShipmentItem>) => {
      const endpoint = steps[getCurrentStepIndex(item.data.type)].endpoint;

      authenticatedFetch
        .client(`/shipments/${shipmentId}/${endpoint}/${item.id}`, session, {
          method: "DELETE",
        })
        .then((response) => {
          if (response && response.status === 204) {
            dispatch(updateUnassigned({ session, shipmentId }));
          }
        });
    },
    [session, shipmentId, dispatch],
  );

  return (
    <>
      <Heading size='md' color='gray.600'>
        {proposal}
      </Heading>
      <Heading>Overview</Heading>
      <Divider borderColor='gray.800' />
      <Box w='100%' flex='1 0 auto' mt='10px' mb='20px'>
        <TreeView flexGrow='1' data={data!} onRemove={handleRemove} onEdit={onActiveChanged} />
      </Box>
      <TreeView
        mb='10px'
        w='100%'
        data={unassigned}
        onEdit={onActiveChanged}
        onRemove={handleDelete}
      />
    </>
  );
};

export default ShipmentOverview;
