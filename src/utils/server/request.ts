"use server";

import { revalidateTag } from "next/cache";
import { authenticatedFetch } from "@/utils/request";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";

/**
 * Perform server-side authenticated fetch
 *
 * @param url Fetch URL
 * @param init Fetch options
 * @returns Fetch body response or redirects user to 401/403 page
 */
export const serverFetch = async (url: RequestInfo, init?: RequestInit) => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  try {
    return await authenticatedFetch(
      process.env.SERVER_API_URL! + url,
      init,
      session?.user.accessToken,
    );
  } catch (e) {
    console.log(e);
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "diamond",
        callbackURL: requestHeaders.get("x-path") ?? "/",
      },
    });
    redirect(url!);
  }
};

/**
 * Perform request and invalidate shipment cache
 *
 * @param url Target endpoint
 * @param init Request options
 * @returns Request JSON body and status
 */
export const requestAndInvalidate = async (url: string, init: RequestInit) => {
  const response = await serverFetch(url, init);

  if (!response) {
    console.error(`Request to ${url} failed, no response`);
    return { status: undefined, json: undefined };
  }

  let responseBody: any = {};

  try {
    responseBody = await response.json();
  } catch {}

  if (response.ok) {
    revalidateTag("shipment");
    if (init.method === "POST" && url.includes("topLevelContainer")) {
      // Since a dewar might be created
      revalidateTag("proposalData");
    }
  } else {
    console.warn(`Request '${url}' returned '${response.status}'`, init, responseBody);
  }

  return { status: response.status, json: responseBody };
};

interface PrepopDataModel {
  labContacts: Record<string, any>;
  proteins: Record<string, any>;
  containers: Record<string, any>;
  dewars: Record<string, any>;
}

export const getPrepopData = async (proposalId: string) => {
  const res = await serverFetch(`/proposals/${proposalId}/data`, {
    cache: "force-cache",
    next: { tags: ["proposalData"] },
  });
  if (res && res.status === 200) {
    return (await res.json()) as PrepopDataModel;
  }
  return {};
};
