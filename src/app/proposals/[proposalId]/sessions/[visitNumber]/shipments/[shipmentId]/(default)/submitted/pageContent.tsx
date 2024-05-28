"use client";

import { ShipmentParams } from "@/types/generic";
import { createShipmentRequest } from "@/utils/client";
import { Button, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";

const ArrangeShipmentButton = ({ params }: { params: ShipmentParams }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    <Button onClick={onShipmentCreateClicked} bg='green.500' isLoading={isLoading}>
      Arrange shipping
    </Button>
  );
};

export default ArrangeShipmentButton;
