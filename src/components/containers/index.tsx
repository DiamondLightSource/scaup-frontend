import { GenericContainer } from "@/components/containers/generic";
import { GridBox } from "@/components/containers/gridBox";
import { BaseShipmentItem } from "@/mappings/pages";
import { Puck } from "./puck";

export interface BaseContainerProps {
  /** Shipment ID */
  shipmentId: string;
}

export interface ContainerProps extends BaseContainerProps {
  /** Container type */
  containerType: BaseShipmentItem["type"];
}

/**
 * Grid box component. Should be used in conjunction with a field allowing the user to select
 * how many slots (capacity) the grid box should have, inside the parent form.
 */
export const Container = ({ shipmentId, containerType }: ContainerProps) => {
  switch (containerType) {
    case "gridBox":
      return <GridBox shipmentId={shipmentId} />;
    case "puck":
      return <Puck shipmentId={shipmentId} />;
    case "falconTube":
      return <GenericContainer shipmentId={shipmentId} />;
    case "genericContainer":
      return <GenericContainer shipmentId={shipmentId} />;
    case "dewar":
      return (
        <GenericContainer shipmentId={shipmentId} parent='topLevelContainers' child='containers' />
      );
    default:
      return null;
  }
};
