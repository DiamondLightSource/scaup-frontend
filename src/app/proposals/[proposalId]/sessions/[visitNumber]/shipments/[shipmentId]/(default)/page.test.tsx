import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import ShipmentHome from "./page";
const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Shipment Submission Overview", () => {
  it("should render item quantities", async () => {
    renderWithProviders(await ShipmentHome({ params: params }));

    expect(screen.getByText(/grid box/i)).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
  });

  it("should render shipment status", async () => {
    server.use(
      http.get("http://localhost/api/shipments/:shipmentId", () =>
        HttpResponse.json({ ...defaultData, data: { status: "Booked" } }),
      ),
    );
    renderWithProviders(await ShipmentHome({ params: params }));

    expect(screen.getByText(/booked/i)).toBeInTheDocument();
  });

  it("should display message if request returns non-200 code", async () => {
    server.use(
      http.get("http://localhost/api/shipments/:shipmentId", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );
    renderWithProviders(await ShipmentHome({ params: params }));

    expect(
      screen.getByText(/this shipment does not exist or you do not have permission to view it./i),
    ).toBeInTheDocument();
  });
});
