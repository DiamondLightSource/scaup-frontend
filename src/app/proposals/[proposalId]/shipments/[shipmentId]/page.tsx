import { authenticatedFetch } from "@/utils/client";
import { Metadata } from "next";
import ItemFormPageContent from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment Overview",
};

const getPrepopData = async (proposalId: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalId}/data`);
  return res && res.status === 200 ? await res.json() : {};
};

const ItemFormPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  // TODO: add type
  const prepopData = await getPrepopData(params.proposalId);

  return <ItemFormPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ItemFormPage;
