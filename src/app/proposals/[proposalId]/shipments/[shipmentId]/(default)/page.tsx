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
  const data = res && res.status === 200 ? await res.json() : [];

  let counts: Record<string, number> = {};

  for (const [key, value] of Object.entries(recursiveCountTypeInstances(data.children))) {
    counts[pascalToSpace(key)] = value;
  }

  // TODO: fetch actual upstream data and type this properly
  const samples: any[] = [];
  const dispatch = { status: "Unknown", ...data.data };

  return { counts, samples, dispatch, name: data.name };
};

const ShipmentHome = async ({ params }: { params: { shipmentId: string; proposalId: string } }) => {
  // TODO: add type
  const shipmentData = await getShipmentData(params.shipmentId);

  return <ShipmentHomeContent params={params} data={shipmentData} />;
};

export default ShipmentHome;
