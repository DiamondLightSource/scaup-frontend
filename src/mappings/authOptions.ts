import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface ExtendedJWT extends JWT {
  accessToken: string;
}

export interface ExtendedSession extends Session {
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  callbacks: {
    async session({ session, token }): Promise<ExtendedSession> {
      const newSession: ExtendedSession = {
        ...session,
        accessToken: (token as ExtendedJWT).accessToken,
      };
      return newSession;
    },
  },
  secret: "secret",
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
          name: user.givenName,
          accessToken: tokens.access_token,
        };
      },
    },
  ],
};
