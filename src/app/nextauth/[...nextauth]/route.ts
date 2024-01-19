import { ExtendedJWT, authOptions } from "@/mappings/authOptions";
import NextAuth from "next-auth";
import { cookies } from "next/headers";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async jwt({ token, account }): Promise<ExtendedJWT> {
      if (account) {
        token.accessToken = account.access_token;
        cookies().set({
          name: `__Host-${process.env.OAUTH_COOKIE_NAME}`,
          value: token.accessToken as string,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
      }
      return token as ExtendedJWT;
    },
  },
});

export { handler as GET, handler as POST };
