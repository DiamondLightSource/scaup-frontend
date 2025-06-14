import { DynamicFormEntry } from "@/types/forms";
import { DynamicFormView } from "@/components/visualisation/formView";
import { ShipmentParams } from "@/types/generic";
import { authenticatedFetch } from "@/utils/client";
import { pascalToSpace } from "@/utils/generic";
import { recursiveCountTypeInstances } from "@/utils/tree";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import { ArrangeShipmentButton } from "@/components/navigation/ArrangeShipmentButton";

export const metadata: Metadata = {
  title: "Sample Collection Submitted - Scaup",
};

const getShipmentData = async (shipmentId: string) => {
  const res = await authenticatedFetch.server(`/shipments/${shipmentId}`);
  const data = res && res.status === 200 ? await res.json() : [];

  const counts = recursiveCountTypeInstances(data.children);
  const formModel: DynamicFormEntry[] = Object.keys(counts).map((key) => ({
    id: key,
    label: pascalToSpace(key),
    type: "text",
  }));

  return { counts, formModel, isBooked: !!(data && data.data.shipmentRequest) };
};

const SubmissionOverview = async (props: { params: Promise<ShipmentParams> }) => {
  const params = await props.params;
  const shipmentData = await getShipmentData(params.shipmentId);

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {params.proposalId}-{params.visitNumber}
        </Heading>
        <Heading>Sample Collection Overview</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <VStack alignItems='start' w='100%' gap='1em'>
        <Text fontSize='18px' my='1em'>
          Your sample information was <b>successfully submitted!</b> You may{" "}
          {Object.keys(shipmentData.counts).length > 0 &&
            "now arrange for your samples to be shipped to Diamond, "}
          <Link
            textDecoration='underline'
            color='diamond.600'
            href={`/proposals/${params.proposalId}/sessions/${params.visitNumber}/shipments/${params.shipmentId}`}
          >
            return to the sample collection summary
          </Link>
          , or{" "}
          <Link
            textDecoration='underline'
            color='diamond.600'
            href={`/proposals/${params.proposalId}/sessions/${params.visitNumber}`}
          >
            return to the sample collection list
          </Link>{" "}
          for further editing before shipping your sample collection.
        </Text>
        {Object.keys(shipmentData.counts).length > 0 && (
          <>
            <Alert status='info' variant='info'>
              <AlertIcon />
              <AlertDescription>
                {shipmentData.isBooked
                  ? "The shipping process has already been started, contents may not be edited any further."
                  : "Once your shipment is booked with the courier service, you will not be able to edit the contents of the shipment any further."}
              </AlertDescription>
            </Alert>
            <VStack w='40%' border='1px solid' borderColor='diamond.300' p='1em'>
              <Heading alignSelf='start'>Contents</Heading>
              <DynamicFormView formType={shipmentData.formModel} data={shipmentData.counts} />
            </VStack>

            <Text fontSize='18px' mt='1em'>
              If you <b>do not plan to use Diamond&#39;s own courier</b> (DHL, on Diamond&#39;s
              account), you <b>do not need to arrange shipping</b> through Diamond. When using your
              own courier, ensure the labels provided by your courier are securely affixed.
            </Text>
            <Text fontSize='18px'>
              If you plan to arrange shipping through Diamond,{" "}
              <b>
                print the tracking labels after you&#39;re finished setting up your shipping details
              </b>
              . This can be done on the{" "}
              <Link
                textDecoration='underline'
                color='diamond.600'
                href={`/proposals/${params.proposalId}/sessions/${params.visitNumber}/shipments/${params.shipmentId}`}
              >
                sample collection summary page
              </Link>
              . You will be automatically redirected to that page once you finish setting up
              shipping.
            </Text>
            <Text fontSize='18px'>
              Tracking labels <b>must</b> be securely affixed to the outside of both dewars and
              dewar cases, even if using your own courier.
            </Text>
            <Alert status='info' variant='info'>
              <AlertIcon />
              <AlertDescription>
                If your shipment originates from outside the UK, and you plan to ship through
                Diamond, email eBIC support at{" "}
                <Link href={`mailto:${process.env.CONTACT_EMAIL}`}>
                  {process.env.CONTACT_EMAIL}
                </Link>
              </AlertDescription>
            </Alert>
            <HStack>
              <ArrangeShipmentButton params={params} isBooked={shipmentData.isBooked} />
              <Button
                as={Link}
                href={`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/tracking-labels`}
              >
                Print Tracking Labels
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </VStack>
  );
};

export default SubmissionOverview;
