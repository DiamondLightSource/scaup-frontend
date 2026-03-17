"use client";
import { ShipmentParams } from "@/types/generic";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrangeShipmentButton } from "@/components/navigation/ArrangeShipmentButton";
import { useState } from "react";
import NextLink from "next/link";

export interface ShippingInstructionsProps {
  params: ShipmentParams;
  isBooked: boolean;
}

export const ShippingInstructions = ({ params, isBooked }: ShippingInstructionsProps) => {
  const [isBookedThroughDiamond, setIsBookedThroughDiamond] = useState<string | null>(null);
  return (
    <>
      <Heading size='lg'>Shipping Options</Heading>
      <Divider />
      <Text>
        I will be shipping my dewar using{" "}
        <b>Diamond&#39;s own courier (DHL, on Diamond&#39;s account)</b>
      </Text>
      <RadioGroup onChange={setIsBookedThroughDiamond} defaultValue={isBooked ? "true" : undefined}>
        <Stack spacing={5} direction='row'>
          <Radio borderColor='black' size='lg' value='true'>
            Yes
          </Radio>
          <Radio borderColor='black' size='lg' value='false' isDisabled={isBooked}>
            No
          </Radio>
        </Stack>
      </RadioGroup>

      {isBookedThroughDiamond !== null || isBooked ? (
        <Box borderLeft='4px solid black' p='1em' mb='1em'>
          {" "}
          {isBookedThroughDiamond === "false" && !isBooked ? (
            <>
              <Text fontSize='18px'>
                When using your own courier, ensure the labels provided by your courier are securely
                affixed
              </Text>
              <Text fontSize='18px' mt='1em'>
                Tracking labels <b>must</b> be securely affixed to the outside of both dewars and
                dewar cases, even if using your own courier.
              </Text>
              <NextLink
                href={`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/tracking-labels`}
              >
                <Button mt='1em'>Print Tracking Labels</Button>
              </NextLink>
            </>
          ) : (
            <>
              <Text fontSize='18px'>
                <b>
                  Print the tracking labels after you&#39;re finished setting up your shipping
                  details
                </b>
                . This can be done on the{" "}
                <Link
                  textDecoration='underline'
                  color='diamond.600'
                  href={`/proposals/${params.proposalId}/sessions/${params.visitNumber}/shipments/${params.shipmentId}/booking-and-labels`}
                >
                  booking and labels page
                </Link>
                . You will be automatically redirected to that page once you finish setting up
                shipping.
              </Text>
              <HStack mt='1em'>
                <ArrangeShipmentButton params={params} isBooked={isBooked} />
              </HStack>
            </>
          )}
        </Box>
      ) : null}
    </>
  );
};
