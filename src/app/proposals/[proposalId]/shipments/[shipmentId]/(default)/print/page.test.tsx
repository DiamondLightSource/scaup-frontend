import { server } from "@/mocks/server";
import { renderWithProviders, sample } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import ShipmentPrintableOverview from "./page";

describe("Shipment Printable Overview Page", () => {
  it("should flatten and render shipment contents", async () => {
    renderWithProviders(
      await ShipmentPrintableOverview({ params: { shipmentId: "1", proposalId: "1" } }),
    );

    expect(screen.getAllByText("Dewar")).toHaveLength(2);
    expect(screen.getByText("Grid Box")).toBeInTheDocument();
  });

  it("should detect unassigned items in shipment", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () => HttpResponse.json({ samples: [sample], containers: [], gridBoxes: [] }),
        { once: true },
      ),
    );

    renderWithProviders(
      await ShipmentPrintableOverview({ params: { shipmentId: "1", proposalId: "1" } }),
    );

    expect(screen.getByText(/this shipment contains unassigned items/i)).toBeInTheDocument();
  });

  it("should render warning if there are no items in the shipment", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(
      await ShipmentPrintableOverview({ params: { shipmentId: "1", proposalId: "1" } }),
    );

    expect(screen.getAllByText(/no assigned items/i)).toHaveLength(2);
  });
});
