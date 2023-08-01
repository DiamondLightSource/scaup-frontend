import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    /** OAuth2 access token */
    accessToken?: accessToken;
    user: {} & DefaultSession["user"];
  }
}
