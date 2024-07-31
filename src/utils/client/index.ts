import { authOptions } from "@/mappings/authOptions";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
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
  init?: RequestInit,
  session?: Session | null,
) => {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(init ? (init.headers as Record<string, string>) : {}),
  };

  if (session === null) {
    throw new Error("Authentication Failure");
  }

  if (session) {
    headers.authorization = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (res.status === 401) {
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
    return await authenticatedFetch(process.env.SERVER_API_URL! + url, init, session);
  } catch (e) {
    console.log(e);
    redirect(`${process.env.NEXTAUTH_URL}/signin`);
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
authenticatedFetch.client = async (url: RequestInfo, init?: RequestInit) => {
  try {
    return await authenticatedFetch(process.env.NEXT_PUBLIC_API_URL! + url, init);
  } catch (e) {
    if (e instanceof Error && e.message === "Authentication Failure") {
      signIn("diamond");
    }
  }
};

export { authenticatedFetch };

interface PrepopDataModel {
  labContacts: Record<string, any>;
  proteins: Record<string, any>;
  containers: Record<string, any>;
  dewars: Record<string, any>;
}

export const getPrepopData = async (proposalId: string) => {
  const res = await authenticatedFetch.server(`/proposals/${proposalId}/data`);
  if (res && res.status === 200) {
    const data = (await res.json()) as PrepopDataModel;
    // As much as it pains me to do so, we must do this as to not add eBIC-specific logic to the form submit handling functions
    data.containers = data.containers.map((field: Record<string, any>) => ({
      ...field,
      actualBarcode: field.barcode,
    }));
    data.containers.unshift({ actualBarcode: "", barcode: "None", comments: null });
    return data;
  }
  return {};
};

/**
 * Create a shipment request in an external shipping service and redirect user
 *
 * @param shipmentId Shipment to create a shipment request for
 */
export const createShipmentRequest = async (shipmentId: string) => {
  const resp = await authenticatedFetch.client(`/shipments/${shipmentId}/request`, {
    method: "POST",
  });

  if (resp && resp.status === 201) {
    window.location.assign(`${process.env.NEXT_PUBLIC_API_URL}/shipments/${shipmentId}/request`);
  } else {
    let message = "Unable to create shipment request";
    try {
      const jsonRep = resp ? await resp.json() : {};
      if (jsonRep.detail) {
        message = jsonRep.detail;
      }
    } catch (e) {
      console.warn(e);
    }

    throw Error(message);
  }
};
