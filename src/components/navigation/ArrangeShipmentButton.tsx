"use client";

import { ShipmentParams } from "@/types/generic";
import { authenticatedFetch } from "@/utils/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const ArrangeShipmentButton = ({
  params,
  isBooked = false,
}: {
  params: ShipmentParams;
  isBooked?: boolean;
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();

  const onShipmentCreateClicked = useCallback(async () => {
    setIsLoading(true);
    const resp = await authenticatedFetch.client(`/shipments/${params.shipmentId}/request`, {
      method: "POST",
    });

    if (resp && resp.status === 201) {
      router.push(`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/request`);
    } else {
      let message = "Unable to create shipment request";

      const jsonRep = resp ? await resp.json() : {};
      if (jsonRep.detail) {
        message = jsonRep.detail;
      }
      onClose();
      console.warn(message);
      toast({ title: message, status: "error" });
    }
    setIsLoading(false);
  }, [params, toast, router, onClose]);

  if (isBooked) {
    return (
      <Button
        onClick={() =>
          router.push(`${process.env.NEXT_PUBLIC_API_URL}/shipments/${params.shipmentId}/request`)
        }
        bg='green.500'
      >
        View Shipping Information
      </Button>
    );
  }

  return (
    <>
      <Button onClick={onOpen} bg='green.500'>
        Arrange Shipping
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Arrange Shipping
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text>Are you sure? You can&apos;t undo this action afterwards.</Text>
              <Text mt="10px">
                This will book a shipment through Diamond&apos;s DHL account, do not proceed if
                you&apos;re shipping internationally or with other couriers.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button bg='green.500' onClick={onShipmentCreateClicked} ml={3} isLoading={isLoading}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
