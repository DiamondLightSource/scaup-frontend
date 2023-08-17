import { ProposalOverviewContent } from "./pageContent";

const getShipments = async (proposalId: string) => {
  //const shipments = await authenticatedFetch(`https://localtest.diamond.ac.uk/api/proposals/${proposalId}/shipments`);

  const shipments = {
    items: [
      { shippingId: 1, shippingName: "test", creationDate: "test", isSubmitted: true },
      { shippingId: 1, shippingName: "test", creationDate: "test" },
      { shippingId: 1, shippingName: "test", creationDate: "test" },
      { shippingId: 1, shippingName: "test", creationDate: "test" },
      { shippingId: 1, shippingName: "test", creationDate: "test" },
    ],
  };

  return shipments.items;
};

const ProposalOverview = async ({ params }: { params: { proposalId: string } }) => {
  const data = await getShipments(params.proposalId);
  return <ProposalOverviewContent proposalId={params.proposalId} data={data} />;
};

export default ProposalOverview;
