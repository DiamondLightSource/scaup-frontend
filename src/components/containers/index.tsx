import { GridBox } from "@/components/containers/gridBox";
import { TreeData } from "@/components/visualisation/treeView";
import { selectActiveItem, selectIsEdit } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { AppDispatch } from "@/store";
import { useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export interface ContainerProps {
  /** Shipment ID */
  shipmentId: string;
}

/**
 * Grid box component. Should be used in conjunction with a field allowing the user to select
 * how many slots (capacity) the grid box should have, inside the parent form.
 */
export const Container = ({ shipmentId }: ContainerProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const currentContainer = useSelector(selectActiveItem);
  const isEdit = useSelector(selectIsEdit);
  const [currentSample, setCurrentSample] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const { control } = useFormContext();

  const capacity = useWatch({ control, name: "capacity", defaultValue: 4 });
  const parsedCapacity = useMemo(() => (capacity ? parseInt(capacity) : 4), [capacity]);

  switch (currentContainer.data.type) {
    case "gridBox":
      return <GridBox shipmentId={shipmentId} />;
  }
};
