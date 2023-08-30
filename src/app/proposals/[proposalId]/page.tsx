import { authenticatedFetch } from "@/utils/client";
import { ProposalOverviewContent } from "./pageContent";

const getShipments = async (proposalId: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalId}/shipments`);

  if (res && res.status === 200) {
    const shipments = await res.json();
    return shipments;
  }
};

const ProposalOverview = async ({ params }: { params: { proposalId: string } }) => {
  const data = await getShipments(params.proposalId);
  return <ProposalOverviewContent proposalId={params.proposalId} data={data} />;
};

export default ProposalOverview;
