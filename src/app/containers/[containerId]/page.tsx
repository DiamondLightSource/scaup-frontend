import { ContainerParams } from "@/types/generic";
import { components } from "@/types/schema";
import { serverFetch } from "@/utils/server/request";
import { parseNetworkError } from "@/utils/generic";
import { Heading, Link, VStack, Text, Code } from "@chakra-ui/react";
import { redirect } from "next/navigation";

const getContainerURL = async (containerId: number) => {
  const resp = await serverFetch(`/containers/${containerId}`);

  if (resp?.status !== 200) {
    const jsonResponse = await resp?.json().catch(() => undefined);
    throw Error(parseNetworkError(jsonResponse));
  }

  const container: components["schemas"]["ContainerOut"] = await resp.json();

  if (container.isInternal) {
    return `/inventory/${container.internalStorageContainer}/${container.type}/${container.id}`;
  }

  const respShipment = await serverFetch(`/shipments/${container.shipmentId}`);

  if (respShipment?.status !== 200) {
    const jsonResponse = await respShipment?.json().catch(() => undefined);
    throw Error(parseNetworkError(jsonResponse));
  }

  const shipment: components["schemas"]["ShipmentOut"] = (await respShipment.json()).data;

  return `/proposals/${shipment.proposalCode}${shipment.proposalNumber}/sessions/\
${shipment.visitNumber}/shipments/${container.shipmentId}/${container.type}/${container.id}/review`;
};

const ContainerRedirect = async (props: { params: Promise<ContainerParams> }) => {
  const { containerId } = await props.params;
  let containerUrl: string | null = null;
  try {
    containerUrl = await getContainerURL(containerId);
  } catch (e: any) {
    console.warn(e);
    return (
      <VStack h='100%' justifyContent='center'>
        <Heading color='diamond.800'>An error has occurred</Heading>
        <Text color='diamond.300'>Container data could not be retrieved:</Text>
        <Code fontFamily='monospace' w='50%' h='30%' overflow='visible' p={3}>
          {typeof e.message === "string" ? e.message : "Internal server error"}
        </Code>
        <Link color='diamond.600' href='/'>
          Go home
        </Link>
      </VStack>
    );
  }

  // This has to be outside the try/catch clause as Next deliberately sends out a signal
  // to halt code execution on redirects, which is interpreted as an exception
  redirect(containerUrl);
};

export default ContainerRedirect;
