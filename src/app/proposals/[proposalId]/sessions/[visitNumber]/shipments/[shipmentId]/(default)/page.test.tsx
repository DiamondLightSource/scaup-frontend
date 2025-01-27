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
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ ...defaultData, data: { status: "Booked" } }),
        { once: true },
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(screen.getByText(/booked/i)).toBeInTheDocument();
  });

  it("should display message if request returns non-200 code", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(
      screen.getByText(
        /this sample collection does not exist or you do not have permission to view it./i,
      ),
    ).toBeInTheDocument();
  });

  it("should not enable 'edit sample collection' button if shipment is already booked", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ ...defaultData, data: { status: "Booked" } }),
        { once: true },
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(screen.getAllByRole("group")[0]).toHaveAttribute("aria-disabled", "true");
  });

  it("should not enable 'print pre-session' button if no pre-session data is available", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/preSession",
        () => HttpResponse.json({}, { status: 404 }),
        {
          once: true,
        },
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(screen.getByTestId("pre-session-label")).toHaveAttribute("aria-disabled", "true");
  });

  it("should display pre-session data if available", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/preSession",
        () => HttpResponse.json({ details: { pixelSize: 150 } }),
        { once: true },
      ),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    expect(screen.getByText("Pixel Size (Å)")).toBeInTheDocument();
  });

  it("should disable booking and labels link if no dewars are present in the sample collection", async () => {
    const noDewarData = structuredClone(defaultData);

    noDewarData.children = [];
    server.use(
      http.get("http://localhost/api/shipments/:shipmentId", () => HttpResponse.json(noDewarData), {
        once: true,
      }),
    );
    renderWithProviders(await ShipmentHome(baseShipmentParams));

    screen.logTestingPlaygroundURL();

    expect(screen.getByTestId("booking-label")).toHaveAttribute("aria-disabled", "true");
  });
});
