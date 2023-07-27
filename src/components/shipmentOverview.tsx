import {
  moveToUnassigned,
  selectItems,
  selectUnassigned,
  setShipment,
} from "@/features/shipment/shipmentSlice";
import { checkIsRoot } from "@/mappings/pages";
import { recursiveFind } from "@/utils/tree";
import { Box, Divider, Heading } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { TreeData, TreeView } from "./treeView";

export interface ShipmentOverviewProps {
  onActiveChanged: (data: TreeData) => void;
  proposal: string;
}

const ShipmentOverview = ({ proposal, onActiveChanged }: ShipmentOverviewProps) => {
  const dispatch = useDispatch();
  const unassigned = useSelector(selectUnassigned);
  const data = useSelector(selectItems);

  const handleRemove = (item: TreeData) => {
    if (checkIsRoot(item)) {
      const innerData = structuredClone(data!);

      recursiveFind(innerData, item.id, (_, i, arr) => {
        arr.splice(i, 1);
      });

      dispatch(setShipment(innerData));
    } else {
      dispatch(moveToUnassigned(item));
    }
  };

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
      <TreeView mb='10px' w='100%' data={unassigned} onEdit={onActiveChanged} />
    </>
  );
};

export default ShipmentOverview;
