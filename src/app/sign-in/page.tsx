import { Metadata } from "next";
import { SignInWrapper } from "./signInWrapper";

export const metadata: Metadata = {
  title: "Sign In - Scaup",
};

// This is silly, but it's by design because of library/browser limitations
// see https://github.com/better-auth/better-auth/issues/5055
// Ideally, the user won't see this much, because of refresh tokens
const SignIn = async (props: { params: Promise<{ callbackURL: string }> }) => {
  const { callbackURL } = await props.params;

  return <SignInWrapper callbackURL={callbackURL} />;
};

export default SignIn;
