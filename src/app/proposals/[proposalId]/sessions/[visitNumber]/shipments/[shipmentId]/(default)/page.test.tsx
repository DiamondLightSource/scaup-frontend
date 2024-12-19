import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { baseShipmentParams, renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import ShipmentHome from "./page";

describe("Sample Collection Submission Overview", () => {
  it("should render item quantities", async () => {
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(screen.getByText(/grid box/i)).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
  });

  it("should render shipment status", async () => {
    server.use(
      http.get("http://localhost/api/shipments/:shipmentId", () =>
        HttpResponse.json({ ...defaultData, data: { status: "Booked" } }),
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(screen.getByText(/booked/i)).toBeInTheDocument();
  });

  it("should display message if request returns non-200 code", async () => {
    server.use(
      http.get("http://localhost/api/shipments/:shipmentId", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(
      screen.getByText(
        /this sample collection does not exist or you do not have permission to view it./i,
      ),
    ).toBeInTheDocument();
  });
});
