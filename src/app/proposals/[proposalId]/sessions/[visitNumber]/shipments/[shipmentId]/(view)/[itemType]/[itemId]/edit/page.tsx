import { getPrepopData } from "@/utils/server/request";
import { Metadata } from "next";
import ItemFormPageContent from "./pageContent";
import { ItemParams } from "@/types/generic";

export const metadata: Metadata = {
  title: "Edit Item - Scaup",
};

const ItemFormPage = async (props: { params: Promise<ItemParams> }) => {
  const params = await props.params;
  const prepopData = await getPrepopData(params.proposalId);

  return <ItemFormPageContent params={params} prepopData={prepopData} />;
};

export default ItemFormPage;
