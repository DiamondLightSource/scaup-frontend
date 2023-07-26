import NextAuth, { NextAuthOptions } from "next-auth";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "diamond",
      name: "Diamond",
      type: "oauth",
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      wellKnown: "https://authalpha.diamond.ac.uk/cas/oidc/.well-known/openid-configuration",
      checks: ["pkce", "state"],
      profile: async (profile, tokens) => {
        const response = await fetch("https://localtest.diamond.ac.uk/auth/user", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const user = await response.json();
        return {
          id: profile.sub,
          email: profile.sub,
          name: user.givenName,
        };
      },
    },
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
