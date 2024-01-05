import { DynamicFormEntry } from "@/components/input/form/input";
import { authenticatedFetch } from "@/utils/client";
import { pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import { revalidateTag } from "next/cache";
import SubmissionOverviewContent from "./pageContent";

const getShipmentData = async (shipmentId: string) => {
  const res = await authenticatedFetch.server(`/shipments/${shipmentId}`);
  const data = res && res.status === 200 ? await res.json() : [];

  const counts = recursiveCountTypeInstances(data.children);
  const formModel: DynamicFormEntry[] = Object.keys(counts).map((key) => ({
    id: key,
    label: pascalToSpace(key),
    type: "text",
  }));

  return { counts, formModel };
};

const SubmissionOverview = async ({
  params,
}: {
  params: { shipmentId: string; proposalId: string };
}) => {
  // TODO: add type
  const shipmentData = await getShipmentData(params.shipmentId);
  revalidateTag(`shipments-${params.proposalId}`);
  revalidateTag(`shipment-${params.proposalId}`);

  return <SubmissionOverviewContent params={params} data={shipmentData} />;
};

export default SubmissionOverview;
