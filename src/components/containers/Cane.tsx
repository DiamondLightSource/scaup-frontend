import { BaseContainerProps } from "@/components/containers";
import { selectUnassigned } from "@/features/shipment/shipmentSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { GenericContainerWithPosition } from "@/components/containers/GenericWithPosition";

export const Cane = (props: BaseContainerProps) => {
  const unassignedItems = useSelector(selectUnassigned);

  const selectableChildren = useMemo(
    () =>
      unassignedItems[0]
        .children!.find((category) => category.name === "Containers")!
        .children!.filter((item) => item.data.type !== "cane"),
    [unassignedItems],
  );

  return (
    <GenericContainerWithPosition
      selectableChildren={selectableChildren}
      capacity={10}
      presetType='cane'
      {...props}
    />
  );
};
