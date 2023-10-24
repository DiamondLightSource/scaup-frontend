import { ProposalOverviewContent } from "@/app/proposals/[proposalId]/pageContent";
import { authenticatedFetch } from "@/utils/client";

const getShipments = async (proposalId: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalId}/shipments`);

  if (res && res.status === 200) {
    const shipments = await res.json();
    return shipments.items;
  }
};

const ProposalOverview = async ({ params }: { params: { proposalId: string } }) => {
  const data = await getShipments(params.proposalId);
  return <ProposalOverviewContent proposalId={params.proposalId} data={data} />;
};

export default ProposalOverview;
