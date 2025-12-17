import { betterAuth } from "better-auth";
import { createAuthMiddleware, genericOAuth } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  basePath: "/auth",
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
      refreshToken: {
        type: "string",
        input: false,
      },
    },
  },
  session: {
    // The refresh token expires in 30 minutes, access tokens expires in 5. This gives users a bit more time to submit
    // their forms before the refresh token expires, but still eagerly refreshes the token every 3 minutes on page loads.
    cookieCache: {
      enabled: true,
      maxAge: 25 * 60,
      strategy: "compact",
      refreshCache: {
        updateAge: 21 * 60,
      },
    },
  },
  advanced: {
    cookiePrefix: "scaup",
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/oauth2/callback/:providerId") {
        const token = await auth.api.getAccessToken({
          body: { providerId: "diamond" },
          headers: ctx.headers,
        });

        ctx.setCookie(process.env.OAUTH_COOKIE_NAME!, token.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "none",
          secure: true,
          maxAge: 250,
        });
      }
    }),
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
            if (!tokens.raw) {
              return null;
            }

            const response = await fetch(process.env.OAUTH_PROFILE_INFO_ENDPOINT || "", {
              headers: { Authorization: `Bearer ${tokens.raw.access_token}` },
            });

            const user = await response.json();
            return {
              id: user.fedid as string,
              fedid: user.fedid as string,
              emailVerified: true,
              email: user.email || (user.fedid as string),
              permissions: user.permissions,
              name: user.givenName as string,
              refreshToken: tokens.raw.refresh_token,
            };
          },
        },
      ],
    }),
    nextCookies(),
  ],
});

// TODO: remove this once Better Auth supports refreshing tokens natively
export const refreshToken = async (token: string) => {
  const data = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID!,
    client_secret: process.env.OAUTH_CLIENT_SECRET!,
    grant_type: "refresh_token",
    scope: "openid",
    refresh_token: token,
  });

  const response = await fetch(process.env.OAUTH_ISSUER! + "/protocol/openid-connect/token", {
    body: data,
    method: "POST",
  });

  if (response.status !== 200) {
    return null;
  }

  const tokens = await response.json();

  return tokens.access_token;
};
