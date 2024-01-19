import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { getShipmentData } from "@/utils/client/shipment";
import { flattenTree } from "@/utils/tree";
import { Metadata } from "next";
import SubmissionOverviewContent from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment Overview - Sample Handling",
};

const sortAndGroup = (data: TreeData<BaseShipmentItem>[]) => {
  const newData = structuredClone(data).sort((a, b) =>
    a.data.type < b.data.type ? -1 : a.data.type > b.data.type ? 1 : 0,
  );

  const groupedItems: Record<string, TreeData<BaseShipmentItem>[]> = {};
  for (const item of newData) {
    if (item.data.type in groupedItems) {
      groupedItems[item.data.type].push(item);
    } else {
      groupedItems[item.data.type] = [item];
    }
  }

  return groupedItems;
};

const SubmissionOverview = async ({
  params,
}: {
  params: { shipmentId: string; proposalId: string };
}) => {
  const rawShipmentData = (await getShipmentData(params.shipmentId)) as TreeData<BaseShipmentItem>;
  const flattenedData = rawShipmentData
    ? sortAndGroup(flattenTree(rawShipmentData).slice(1))
    : null;

  const unassignedData = await getShipmentData(params.shipmentId, "/unassigned");
  let hasUnassigned = false;

  if (unassignedData) {
    hasUnassigned = Object.values(unassignedData).some((array) => array.length > 0);
  }

  return (
    <SubmissionOverviewContent params={params} data={flattenedData} hasUnassigned={hasUnassigned} />
  );
};

export default SubmissionOverview;
