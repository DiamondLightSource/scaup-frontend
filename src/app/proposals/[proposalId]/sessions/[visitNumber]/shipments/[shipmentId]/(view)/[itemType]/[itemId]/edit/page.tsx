import { getPrepopData } from "@/utils/client";
import { Metadata } from "next";
import ItemFormPageContent from "./pageContent";

export const metadata: Metadata = {
  title: "Edit Item - Sample Handling",
};

const ItemFormPage = async (props: {
  params: Promise<{ proposalId: string; shipmentId: string }>;
}) => {
  const params = await props.params;
  const prepopData = await getPrepopData(params.proposalId);

  return <ItemFormPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ItemFormPage;
