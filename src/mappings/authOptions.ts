import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  callbacks: {
    async session({ session, token }) {
      const newSession = {
        ...session,
        accessToken: token.accessToken,
        permissions: token.permissions
      };
      return newSession;
    },
  },
  session: {
    maxAge: 60 * 60 * 6,
  },
  providers: [
    {
      id: "diamond",
      name: "Diamond",
      type: "oauth",
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
          id: profile.sub,
          email: profile.sub,
          permissions: user.permissions,
          name: user.givenName,
          accessToken: tokens.access_token,
        };
      },
    },
  ],
};
