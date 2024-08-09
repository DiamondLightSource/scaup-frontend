import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    /** OAuth2 access token */
    accessToken?: accessToken;
    permissions: string[];
    user: {} & DefaultSession["user"];
  }

  interface User {
    permissions: string[];
  }

  interface JWT extends Record<string, unknown>, DefaultJWT {
    accessToken?: string;
    permissions: string[];
  }
}
