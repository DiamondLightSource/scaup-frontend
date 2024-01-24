import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { getShipmentData } from "@/utils/client/shipment";
import { Metadata } from "next";
import SubmissionOverviewContent from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment Overview - Sample Handling",
};

const SubmissionOverview = async ({
  params,
}: {
  params: { shipmentId: string; proposalId: string };
}) => {
  const rawShipmentData = (await getShipmentData(params.shipmentId)) as TreeData<BaseShipmentItem>;
  const unassignedData = await getShipmentData(params.shipmentId, "/unassigned");
  let hasUnassigned = false;

  if (unassignedData) {
    hasUnassigned = Object.values(unassignedData).some((array) => array.length > 0);
  }

  return (
    <SubmissionOverviewContent
      params={params}
      shipment={rawShipmentData}
      hasUnassigned={hasUnassigned}
    />
  );
};

export default SubmissionOverview;
