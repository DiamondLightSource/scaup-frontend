import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import { Metadata } from "next";
import ShipmentHomeContent from "./pageContent";

export const metadata: Metadata = {
  title: "Shipment - Sample Handling",
};

const getShipmentData = async (shipmentId: string) => {
  const res = await authenticatedFetch.server(`/shipments/${shipmentId}`);
  const data: components["schemas"]["ShipmentChildren"] =
    res && res.status === 200 ? await res.json() : [];

  let counts: Record<string, number> = {};

  for (const [key, value] of Object.entries(recursiveCountTypeInstances(data.children))) {
    counts[pascalToSpace(key)] = value;
  }

  const samples: components["schemas"]["GenericItem"][] = [];

  return { counts, samples, dispatch: data.data, name: data.name };
};

const ShipmentHome = async ({ params }: { params: { shipmentId: string; proposalId: string } }) => {
  const shipmentData = await getShipmentData(params.shipmentId);

  return <ShipmentHomeContent params={params} data={shipmentData} />;
};

export default ShipmentHome;
