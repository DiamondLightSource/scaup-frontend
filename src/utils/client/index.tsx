import { authOptions } from "@/mappings/authOptions";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

/**
 * Perform authenticated fetch operation
 *
 * @param url Fetch URL
 * @param session Session object with access token
 * @param init Fetch options
 *
 * @returns Fetch body response
 */
const authenticatedFetch = async (
  url: RequestInfo,
  session: Session | null,
  init?: RequestInit,
) => {
  if (!session) {
    return null;
  }

  const res = await fetch(process.env.REACT_APP_API_URL! + url, {
    ...init,
    headers: {
      authorization: `Bearer ${session.accessToken}`,
      "content-type": "application/json",
      ...(init ? init.headers : {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Authentication Failure");
  }

  return res;
};

/**
 * Perform server-side authenticated fetch
 *
 * @param url Fetch URL
 * @param init Fetch options
 * @returns Fetch body response or redirects user to 401/403 page
 */
authenticatedFetch.server = async (url: RequestInfo, init?: RequestInit) => {
  const session = await getServerSession(authOptions);

  try {
    return await authenticatedFetch(url, session, init);
  } catch (e) {
    if (e instanceof Error && e.message === "Authentication Failure") {
      redirect("/");
    }
  }
};

/**
 * Perform client-side authenticated fetch
 *
 * @param url Fetch URL
 * @param session Session object with access token
 * @param init Fetch options
 * @returns Fetch body response, null if session is undefined, or redirects user to 401/403 page
 */
authenticatedFetch.client = async (
  url: RequestInfo,
  session: Session | null,
  init?: RequestInit,
) => {
  if (session === undefined) {
    return null;
  }

  try {
    return await authenticatedFetch(url, session, init);
  } catch (e) {
    if (e instanceof Error && e.message === "Authentication Failure") {
      window.location.replace("/401");
    }
  }
};

export { authenticatedFetch };

export const getPrepopData = async (proposalId: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalId}/data`);
  return res && res.status === 200 ? await res.json() : {};
};
