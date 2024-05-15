import { redirect } from "next/navigation";

const SessionRedirect = () => {
  redirect(`${process.env.PATO_URL}/proposals`);
};

export default SessionRedirect;
