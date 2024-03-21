import { authenticatedFetch } from "@/utils/client";

export const getShipmentData = async (
  shipmentId: string,
  suffix: string = "",
): Promise<Record<string, any> | null> => {
  const res = await authenticatedFetch.server(`/shipments/${shipmentId}${suffix}`);

  return res && res.status === 200 ? await res.json() : null;
};
