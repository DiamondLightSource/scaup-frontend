import { RootParentType } from "@/types/generic";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";

export const parentTypeToEndpoint: Record<RootParentType, string> = {
  shipment: "shipments",
  topLevelContainer: "internal-containers",
};

export const getShipmentData = async (
  shipmentId: string,
  suffix: string = "",
  parentType: RootParentType = "shipment",
) => {
  const res = await authenticatedFetch.server(
    `/${parentTypeToEndpoint[parentType]}/${shipmentId}${suffix}`,
    {
      cache: "force-cache",
      next: { tags: ["shipment"] },
    },
  );

  return res && res.status === 200
    ? ((await res.json()) as components["schemas"]["ShipmentChildren"])
    : null;
};
