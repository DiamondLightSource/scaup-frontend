import { signIn } from "@/utils/client/auth";
import { authenticatedFetch } from "@/utils/request";

/**
 * Perform client-side authenticated fetch
 *
 * @param url Fetch URL
 * @param session Session object with access token
 * @param init Fetch options
 * @returns Fetch body response, null if session is undefined, or redirects user to 401/403 page
 */
export const clientFetch = async (url: RequestInfo, init?: RequestInit) => {
  try {
    return await authenticatedFetch(process.env.NEXT_PUBLIC_API_URL! + url, init);
  } catch (e) {
    if (e instanceof Error && e.message === "Authentication Failure") {
      await signIn.social({ provider: "diamond" });
    }
  }
};
