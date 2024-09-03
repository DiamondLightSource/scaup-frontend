"use client";

import { ShipmentParams } from "@/types/generic";
import { createShipmentRequest } from "@/utils/client";
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
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";

const ArrangeShipmentButton = ({ params }: { params: ShipmentParams }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const onShipmentCreateClicked = useCallback(async () => {
    try {
      setIsLoading(true);
      await createShipmentRequest(params.shipmentId);
    } catch (e) {
      toast({ title: (e as Error).message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [params, toast]);

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
              Are you sure? You can&apos;t undo this action afterwards.
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

export default ArrangeShipmentButton;
