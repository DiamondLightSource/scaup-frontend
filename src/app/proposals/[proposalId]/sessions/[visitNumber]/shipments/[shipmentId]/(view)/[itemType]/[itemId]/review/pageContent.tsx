"use client";

import { Container } from "@/components/containers";
import { DynamicFormView } from "@/components/visualisation/formView";
import {
  selectActiveItem,
  selectIsEdit,
  selectItems,
  setActiveItem,
  setIsReview,
} from "@/features/shipment/shipmentSlice";
import { ItemFormPageContentProps } from "@/types/generic";
import { Alert, AlertDescription, AlertIcon, Box, Skeleton, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewPageContent = ({ shipmentId, prepopData }: ItemFormPageContentProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectItems);
  const isEdit = useSelector(selectIsEdit);
  const activeItem = useSelector(selectActiveItem);

  useEffect(() => {
    if (!isEdit && activeItem && items && items.length > 0) {
      // If current active item does not exist
      const newItem = items[0];
      dispatch(setActiveItem({ item: newItem, isEdit: true }));
      router.replace(`../../${newItem.data.type}/${newItem.id}/review`);
    }
    dispatch(setIsReview(true));
  }, [dispatch, items, router, activeItem, isEdit]);

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
        <Container parentId={shipmentId} containerType={activeItem!.data.type} />
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
