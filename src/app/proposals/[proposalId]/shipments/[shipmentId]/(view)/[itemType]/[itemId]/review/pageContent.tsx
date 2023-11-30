"use client";

import { Container } from "@/components/containers";
import { DynamicFormView } from "@/components/visualisation/formView";
import {
  selectActiveItem,
  selectItems,
  setActiveItem,
  setStep,
} from "@/features/shipment/shipmentSlice";
import { steps } from "@/mappings/pages";
import { ItemFormPageContentProps } from "@/types/generic";
import { Alert, AlertDescription, AlertIcon, Box, Skeleton, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewPageContent = ({ shipmentId, prepopData }: ItemFormPageContentProps) => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const activeItem = useSelector(selectActiveItem);

  useEffect(() => {
    if (items.length > 0) {
      dispatch(setActiveItem({ item: items![0], isEdit: true }));
    }
    dispatch(setStep(steps.length));
  }, [dispatch, items]);

  return (
    <VStack h='100%' w='100%'>
      <Box display='flex' flexDirection='row' width='100%' flex='1 0 auto'>
        {activeItem ? (
          <VStack flex='1 0 auto'>
            <DynamicFormView
              formType={activeItem.data.type}
              data={activeItem.data}
              prepopData={prepopData}
            />
          </VStack>
        ) : (
          <Skeleton h='80%' w='100%' />
        )}
        <Container shipmentId={shipmentId} containerType={activeItem!.data.type} />
      </Box>
      <Alert status='info' variant='info'>
        <AlertIcon />
        <AlertDescription>You can still edit your shipment after submitting.</AlertDescription>
      </Alert>
    </VStack>
  );
};

export default ReviewPageContent;
