import { getPrepopData } from "@/utils/client";
import { Metadata } from "next";
import ReviewPageContent from "./pageContent";

export const metadata: Metadata = {
  title: "Review Sample Collection - Scaup",
};

const ReviewPage = async (props: {
  params: Promise<{ proposalId: string; shipmentId: string }>;
}) => {
  const params = await props.params;
  const prepopData = await getPrepopData(params.proposalId);

  return <ReviewPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ReviewPage;
