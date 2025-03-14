import { getPrepopData } from "@/utils/client";
import { Metadata } from "next";
import ReviewPageContent from "./pageContent";
import { ItemParams } from "@/types/generic";

export const metadata: Metadata = {
  title: "Review Sample Collection - Scaup",
};

const ReviewPage = async (props: { params: Promise<ItemParams> }) => {
  const params = await props.params;
  const prepopData = await getPrepopData(params.proposalId);

  return <ReviewPageContent params={params} prepopData={prepopData} />;
};

export default ReviewPage;
