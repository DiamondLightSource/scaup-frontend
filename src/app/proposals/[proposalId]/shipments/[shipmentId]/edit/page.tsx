import { getPrepopData } from "@/utils/client";
import ItemFormPageContent from "./pageContent";

const ItemFormPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  const prepopData = await getPrepopData(params.proposalId);

  return <ItemFormPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ItemFormPage;
