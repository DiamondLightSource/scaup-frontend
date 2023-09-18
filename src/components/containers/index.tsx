import { GenericContainer } from "@/components/containers/generic";
import { GridBox } from "@/components/containers/gridBox";
import { BaseShipmentItem } from "@/mappings/pages";

export interface ContainerProps {
  /** Shipment ID */
  shipmentId: string;
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
      return <>aaaaaaaaaaaaaaaaaaaa</>;
    case "falconTube":
      return <GenericContainer shipmentId={shipmentId} />;
    default:
      return null;
  }
};
