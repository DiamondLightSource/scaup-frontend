import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  callbacks: {
    async session({ session, token }) {
      const newSession = {
        ...session,
        accessToken: token.accessToken,
        permissions: token.permissions,
        id: token.id
      };
      return newSession;
    },
  },
  session: {
    maxAge: 60 * 3,
  },
  providers: [
    {
      authorization: {params: {scope: "openid profile email fedid"}},
      id: "diamond",
      name: "Diamond",
      type: "oauth",
      idToken: true,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      wellKnown: process.env.OAUTH_DISCOVERY_ENDPOINT,
      checks: ["pkce", "state"],
      profile: async (profile, tokens) => {
        const response = await fetch(process.env.OAUTH_PROFILE_INFO_ENDPOINT || "", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const user = await response.json();
        return {
          id: profile.fedid,
          email: profile.email,
          permissions: user.permissions,
          name: profile.given_name,
          accessToken: tokens.access_token,
        };
      },
    },
  ],
};
