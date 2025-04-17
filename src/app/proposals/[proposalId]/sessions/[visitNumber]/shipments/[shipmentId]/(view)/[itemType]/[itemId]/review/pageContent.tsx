"use client";

import { Container } from "@/components/containers";
import { DynamicFormView } from "@/components/visualisation/formView";
import {
  selectActiveItem,
  selectItems,
  setIsReview,
  syncActiveItem,
} from "@/features/shipment/shipmentSlice";
import { ItemFormPageContentProps } from "@/types/generic";
import { Alert, AlertDescription, AlertIcon, Box, Skeleton, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewPageContent = ({ params, prepopData }: ItemFormPageContentProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectItems);
  const activeItem = useSelector(selectActiveItem);

  useEffect(() => {
    dispatch(syncActiveItem({ id: Number(params.itemId), type: params.itemType }));
    dispatch(setIsReview(true));
  }, [dispatch, items, router, params]);

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
        <Container
          parentId={params.shipmentId}
          containerType={activeItem!.data.type}
          containerSubType={activeItem!.data.subType}
        />
      </Box>
      <Alert status='info' variant='info'>
        <AlertIcon />
        <AlertDescription>
          You can still edit your sample collection after submitting.
        </AlertDescription>
      </Alert>
    </VStack>
  );
};

export default ReviewPageContent;
