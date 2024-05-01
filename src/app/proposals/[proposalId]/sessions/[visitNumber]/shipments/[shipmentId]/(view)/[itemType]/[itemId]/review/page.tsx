import { getPrepopData } from "@/utils/client";
import { Metadata } from "next";
import ReviewPageContent from "./pageContent";

export const metadata: Metadata = {
  title: "Review Shipment - Sample Handling",
};

const ReviewPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  const prepopData = await getPrepopData(params.proposalId);

  return <ReviewPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ReviewPage;
