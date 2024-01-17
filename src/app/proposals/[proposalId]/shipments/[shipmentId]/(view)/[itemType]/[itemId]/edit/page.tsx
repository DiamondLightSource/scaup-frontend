import { getPrepopData } from "@/utils/client";
import { Metadata } from "next";
import ItemFormPageContent from "./pageContent";

export const metadata: Metadata = {
  title: "Edit Item - Sample Handling",
};

const ItemFormPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  const prepopData = await getPrepopData(params.proposalId);

  return <ItemFormPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ItemFormPage;
