import { GenericContainer } from "@/components/containers/generic";
import { GridBox } from "@/components/containers/gridBox";
import { BaseShipmentItem } from "@/mappings/pages";
import { UseFormReturn } from "react-hook-form";
import { Puck } from "./puck";

export interface BaseContainerProps {
  /** Shipment ID */
  shipmentId: string;
  formContext?: UseFormReturn<BaseShipmentItem>;
}

export interface ContainerProps extends BaseContainerProps {
  /** Container type */
  containerType: BaseShipmentItem["type"];
}

/**
 * Grid box component. Should be used in conjunction with a field allowing the user to select
 * how many slots (capacity) the grid box should have, inside the parent form.
 */
export const Container = ({ containerType, ...props }: ContainerProps) => {
  switch (containerType) {
    case "gridBox":
      return <GridBox {...props} />;
    case "puck":
      return <Puck {...props} />;
    case "falconTube":
      return <GenericContainer {...props} />;
    case "genericContainer":
      return <GenericContainer shipmentId={shipmentId} />;
    case "dewar":
      return (
        <GenericContainer shipmentId={shipmentId} parent='topLevelContainers' child='containers' {...props}  />
      );
    default:
      return null;
  }
};
