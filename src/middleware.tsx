import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    // NextAuth ignores NEXTAUTH_URL in middleware for some reason
    signIn: process.env.NEXTAUTH_URL + "/signin/diamond",
  },
});
