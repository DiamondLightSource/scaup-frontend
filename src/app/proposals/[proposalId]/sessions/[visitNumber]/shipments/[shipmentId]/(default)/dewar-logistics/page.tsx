import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { formatDate } from "@/utils/generic";
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Link,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import { steps } from "framer-motion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Returns - Scaup",
};

const getTopLevelContainers = async (shipmentId: string) => {
  const resTlc = await authenticatedFetch.server(`/shipments/${shipmentId}/topLevelContainers`);

  if (resTlc.status === 200) {
    return (await resTlc.json()).items;
  }

  return null;
};

const ReturnRequests = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const tlcData = await getTopLevelContainers(params.shipmentId);

  return (
    <VStack gap='0' alignItems='start' w='100%'>
      <Heading size='md' color='gray.600'>
        Shipment
      </Heading>
      <Heading>Manage Dewar Logistics</Heading>
      <Divider borderColor='gray.800' />
      <VStack alignItems='start' maxW='1000px' my='1em'>
        <Text>View tracking history or ask for dewars to be returned to your facility.</Text>
        <Text>
          Once your shipment has arrived at Diamond, you may request for it to be returned to your
          home facility. This request is processed by SynchWeb, and you will be taken to an external
          application to complete your return request.
        </Text>
        <VStack
          alignItems='start'
          divider={<Divider borderColor='diamond.600' />}
          my='1em'
          gap='0.3em'
          w='100%'
        >
          {tlcData !== null && tlcData.length > 0 ? (
            tlcData.map((tlc: components["schemas"]["TopLevelContainerOut"]) => (
              <VStack key={tlc.id} w='100%'>
                <HStack w='100%'>
                  <Heading flex='1 0 0' size='lg'>
                    {tlc.name ?? "Unnamed Dewar"}
                  </Heading>
                  <Button
                    as={Link}
                    href={`${process.env.SYNCHWEB_URL}/dewars/dispatch/${tlc.externalId}`}
                  >
                    Request Return
                  </Button>
                </HStack>
                <Divider />
                <HStack w='100%' my='1em' gap='2em' flexWrap='wrap' alignItems='start'>
                  <VStack
                    alignItems='start'
                    flex='1 0 400px'
                    borderRight='1px solid'
                    borderColor='diamond.100'
                  >
                    <Heading size='md'>Transport History</Heading>
                    <Box w='100%' overflowY='scroll' h='20em' p='1em'>
                      {tlc.history ? (
                        <Stepper index={0} orientation='vertical' height='400px' gap='0' size='sm'>
                          {tlc.history.map((item, index) => (
                            <Step key={index}>
                              <StepIndicator
                                sx={{
                                  "[data-status=active] &": {
                                    background: "diamond.800",
                                    borderColor: "diamond.800",
                                    color: "diamond.50",
                                  },
                                  "[data-status=incomplete] &": {
                                    background: "diamond.50",
                                    borderColor: "diamond.700",
                                  },
                                }}
                              >
                                <StepStatus />
                              </StepIndicator>

                              <Box flexShrink='0'>
                                <StepTitle>{item.dewarStatus}</StepTitle>
                                <StepDescription>
                                  {item.storageLocation}
                                  {item.storageLocation ? " - " : ""}
                                  {formatDate(item.arrivalDate || "")}
                                </StepDescription>
                              </Box>

                              <StepSeparator />
                            </Step>
                          ))}
                        </Stepper>
                      ) : (
                        <Heading size='md' variant='notFound'>
                          No history found for this dewar
                        </Heading>
                      )}
                    </Box>
                  </VStack>

                  <VStack width='33%' minW='15em' alignItems='start'>
                    <Heading size='md'>Barcode</Heading>
                    <Text>{tlc.barCode}</Text>
                    <Heading size='md'>Comments</Heading>
                    <Text>{tlc.comments || "No comments"}</Text>
                  </VStack>
                </HStack>
              </VStack>
            ))
          ) : (
            <Heading variant='notFound'>No dewars found for this shipment</Heading>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ReturnRequests;
