import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { ShipmentCard } from "./ShipmentCard";
import { components } from "@/types/schema";

const baseShipment: components["schemas"]["ShipmentOut"] = {
  id: 1,
  name: "new-shipment",
  creationDate: "2025-01-01 01:01:01",
  proposalCode: "cm",
  proposalNumber: 12345,
  visitNumber: 1,
  lastStatusUpdate: "2025-01-01 01:01:01"
};

describe("Shipment Card", () => {
  it("should render shipment card", () => {
    renderWithProviders(<ShipmentCard shipment={baseShipment} />);

    expect(screen.getByText("new-shipment")).toBeInTheDocument();
  });

  it("should render '?' if no valid date is provided", () => {
    renderWithProviders(
      <ShipmentCard shipment={{...baseShipment, creationDate: null}} />
    );

    expect(screen.getByText("Creation Date: ?")).toBeInTheDocument()
  });
});
