import { redirect } from "next/navigation";

const ProposalRedirect = ({ params }: { params: { proposalId: string } }) => {
  redirect(`${process.env.PATO_URL}/proposals/${params.proposalId}/sessions`);
};

export default ProposalRedirect;
