import { authenticatedFetch } from "@/utils/client";
import ItemFormPageContent from "./pageContent";

const ItemFormPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  const prepopData = await authenticatedFetch.server(`/proposals/${params.proposalId}/data`);

  return <ItemFormPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ItemFormPage;
