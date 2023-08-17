import { authenticatedFetch } from "@/utils/client";
import ItemFormPageContent from "./pageContent";

const getPrepopData = async (proposalId: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalId}/data`);
  return res && res.status === 200 ? await res.json() : {};
};

const ItemFormPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  const prepopData = await getPrepopData(params.proposalId);

  return <ItemFormPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ItemFormPage;
