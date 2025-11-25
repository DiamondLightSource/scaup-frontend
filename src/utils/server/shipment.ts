import { RootParentType } from "@/types/generic";
import { components } from "@/types/schema";
import { serverFetch } from "@/utils/server/request";

export const parentTypeToEndpoint: Record<RootParentType, string> = {
  shipment: "shipments",
  topLevelContainer: "internal-containers",
};

export const getShipmentData = async (
  shipmentId: string,
  suffix: string = "",
  parentType: RootParentType = "shipment",
  getChildren: boolean = true,
) => {
  const res = await serverFetch(
    `/${parentTypeToEndpoint[parentType]}/${shipmentId}${suffix}?getChildren=${getChildren}`,
    {
      cache: "force-cache",
      next: { tags: [getChildren ? "shipment" : "childless-shipment"] },
    },
  );

  return res && res.status === 200
    ? ((await res.json()) as components["schemas"]["ShipmentChildren"])
    : null;
};
