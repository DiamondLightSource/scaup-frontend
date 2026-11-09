import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";

const domain = new URL(process.env.PORTAL_URL ?? "https://local-oidc-test.diamond.ac.uk:9000");

export const auth = betterAuth({
  basePath: "/auth",
  user: {
    additionalFields: {
      permissions: {
        type: "string[]",
        input: true,
      },
      fedid: {
        type: "string",
        input: true,
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
    cookiePrefix: "evo",
    crossSubDomainCookies: {
      enabled: true,
      // We do not use subdomains in dev
      domain: process.env.NODE_ENV === "development" ? undefined : "." + domain.host,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
    updateAccountOnSignIn: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/social") {
        const token = await auth.api.getAccessToken({
          body: { useAccountCookie: true },
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
              sub: user.fedid as string,
              fedid: user.fedid as string,
              emailVerified: true,
              email: user.email || (user.fedid as string),
              permissions: user.permissions,
              name: user.givenName as string,
            };
          },
          mapProfileToUser: async (profile) => ({
            sub: profile.sub,
            fedid: profile.fedid,
            permissions: profile.permissions,
          }),
        },
      ],
    }),
    nextCookies(),
  ],
});
