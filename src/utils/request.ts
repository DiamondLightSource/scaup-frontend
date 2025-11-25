/**
 * Perform authenticated fetch operation
 *
 * @param url Fetch URL
 * @param session Session object with access token
 * @param init Fetch options
 *
 * @returns Fetch body response
 */
export const authenticatedFetch = async (
  url: RequestInfo,
  init?: RequestInit,
  token?: string | null,
) => {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(init ? (init.headers as Record<string, string>) : {}),
  };

  if (token === null) {
    throw new Error("Authentication Failure");
  }

  if (token) {
    headers.authorization = `Bearer ${token}`;
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
