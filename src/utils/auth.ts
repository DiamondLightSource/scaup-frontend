import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  user: {
    additionalFields: {
      permissions: {
        type: "string[]",
        input: false,
      },
      fedid: {
        type: "string",
        input: false,
      },
      accessToken: {
        type: "string",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 4, // 4 minutes
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "diamond",
          clientId: process.env.OAUTH_CLIENT_ID!,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          discoveryUrl: process.env.OAUTH_DISCOVERY_ENDPOINT,
          scopes: ["openid"],
          getUserInfo: async (tokens) => {
            const response = await fetch(process.env.OAUTH_PROFILE_INFO_ENDPOINT || "", {
              headers: { Authorization: `Bearer ${tokens.accessToken}` },
            });

            if (!tokens.raw) {
              return null;
            }

            const user = await response.json();
            return {
              id: user.fedid as string,
              fedid: user.fedid as string,
              emailVerified: true,
              email: user.email || (user.fedid as string),
              permissions: user.permissions,
              name: user.givenName as string,
              accessToken: tokens.accessToken,
            };
          },
        },
      ],
    }),
    nextCookies(),
  ],
});
