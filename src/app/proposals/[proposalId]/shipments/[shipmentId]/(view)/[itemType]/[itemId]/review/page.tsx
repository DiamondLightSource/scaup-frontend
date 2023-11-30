import { getPrepopData } from "@/utils/client";
import ReviewPageContent from "./pageContent";

const ReviewPage = async ({ params }: { params: { proposalId: string; shipmentId: string } }) => {
  const prepopData = await getPrepopData(params.proposalId);

  return <ReviewPageContent shipmentId={params.shipmentId} prepopData={prepopData} />;
};

export default ReviewPage;
