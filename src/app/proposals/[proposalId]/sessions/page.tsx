import { redirect } from "next/navigation";

const ProposalRedirect = async (props: { params: Promise<{ proposalId: string }> }) => {
  const params = await props.params;
  redirect(`${process.env.PATO_URL}/proposals/${params.proposalId}/sessions`);
};

export default ProposalRedirect;
