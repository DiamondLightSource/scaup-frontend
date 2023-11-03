"use client";

import { Container } from "@/components/containers";
import { DynamicFormView } from "@/components/visualisation/formView";
import {
  selectActiveItem,
  selectItems,
  setActiveItem,
  setStep,
} from "@/features/shipment/shipmentSlice";
import { getCurrentStepIndex, steps } from "@/mappings/pages";
import { Box, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewPage = ({ params }: { params: { shipmentId: string } }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const activeItem = useSelector(selectActiveItem);
  const activeStep = useMemo(
    () => steps[getCurrentStepIndex(activeItem.data.type)].singular,
    [activeItem],
  );

  useEffect(() => {
    if (items.length > 0) {
      dispatch(setActiveItem({ item: items![0], isEdit: true }));
    }
    dispatch(setStep(steps.length));
  }, [dispatch, items]);

  return (
    <VStack h='100%' w='65%' alignItems='start'>
      <VStack spacing='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          {activeStep}
        </Heading>
        <Heading>{activeItem.name}</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      <Box display='flex' flexDirection='column' width='100%' flex='1 0 auto'>
        <DynamicFormView formType={activeItem.data.type} data={activeItem.data} />
        <Container shipmentId={params.shipmentId} containerType={activeItem.data.type} />
      </Box>
      <Text fontWeight='600' color='gray.600'>
        You can still edit your shipment after submitting
      </Text>
    </VStack>
  );
};

export default ReviewPage;
