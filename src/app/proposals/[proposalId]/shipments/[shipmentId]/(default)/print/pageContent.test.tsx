import { BaseShipmentItem } from "@/mappings/pages";
import { gridBox, renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import PrintableOverviewContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };
const defaultShipment = {
  name: "Shipment",
  id: 1,
  data: { type: "shipment" as BaseShipmentItem["type"] },
  children: [
    {
      id: "dewar",
      name: "dewar",
      data: { type: "dewar" },
      children: [
        {
          id: "container",
          name: "container",
          data: { type: "puck" },
          children: [gridBox],
        },
      ],
    },
  ],
};

describe("Shipment Printable Overview", () => {
  it("should render warning if shipment has unassigned items", () => {
    renderWithProviders(
      <PrintableOverviewContent shipment={defaultShipment} params={params} hasUnassigned={true} />,
    );

    expect(screen.getByText(/this shipment contains unassigned items/i)).toBeInTheDocument();
  });

  it("should position if item has position", () => {
    renderWithProviders(
      <PrintableOverviewContent shipment={defaultShipment} params={params} hasUnassigned={false} />,
    );

    expect(screen.getByText("In container, position 6")).toBeInTheDocument();
  });

  it("should render parent name if item has parent", () => {
    renderWithProviders(
      <PrintableOverviewContent shipment={defaultShipment} params={params} hasUnassigned={false} />,
    );

    expect(screen.getByText(/in container/i)).toBeInTheDocument();
    expect(screen.getByText("In dewar")).toBeInTheDocument();
  });

  it("should render warning message in body if shipment has no items", () => {
    renderWithProviders(
      <PrintableOverviewContent shipment={null} params={params} hasUnassigned={false} />,
    );
    expect(screen.getAllByText(/no assigned items/i)).toHaveLength(2);
  });
});
