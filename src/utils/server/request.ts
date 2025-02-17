"use server";

import { revalidateTag } from "next/cache";
import { authenticatedFetch } from "@/utils/client";

/**
 * Perform request and invalidate shipment cache
 *
 * @param url Target endpoint
 * @param init Request options
 * @returns Request JSON body and status
 */
export const requestAndInvalidate = async (url: string, init: RequestInit) => {
  const response = await authenticatedFetch.server(url, init);

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
