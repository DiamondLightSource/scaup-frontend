import { render, screen } from "@testing-library/react";

import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import ReturnRequests from "./page";
import { baseShipmentParams } from "@/utils/test-utils";

describe("Dewar Logistics", () => {
  it("should render available dewars", async () => {
    render(await ReturnRequests(baseShipmentParams));

    expect(screen.getByText(/dewar-001/i)).toBeInTheDocument();
    expect(screen.getByText(/request return/i)).toBeInTheDocument();
  });

  it("should render message if request fails", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/topLevelContainers",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    render(await ReturnRequests(baseShipmentParams));
    expect(screen.getByText(/no dewars/i)).toBeInTheDocument();
  });

  it("should render message if no dewars are available", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/topLevelContainers",
        () => HttpResponse.json({ items: [] }, { status: 200 }),
        { once: true },
      ),
    );

    render(await ReturnRequests(baseShipmentParams));
    expect(screen.getByText(/no dewars/i)).toBeInTheDocument();
  });

  it("should display dewar history", async () => {
    render(await ReturnRequests(baseShipmentParams));
    expect(screen.getByText(/opened/i)).toBeInTheDocument();
    expect(screen.getByText("m01 - 01/01/2025, 00:00:00")).toBeInTheDocument();
  });

  it("should display message if no dewar history is available", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/topLevelContainers",
        () =>
          HttpResponse.json(
            {
              items: [
                {
                  externalId: 1,
                  status: "Booked",
                  id: 1,
                  name: "Dewar-001",
                  history: null,
                },
              ],
              total: 1,
              limit: 20,
            },
            { status: 200 },
          ),
        { once: true },
      ),
    );

    render(await ReturnRequests(baseShipmentParams));
    expect(screen.getByText("No history found for this dewar")).toBeInTheDocument();
  });

  it("should only display date for history step if no storage location is available", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/topLevelContainers",
        () =>
          HttpResponse.json(
            {
              items: [
                {
                  externalId: 1,
                  status: "Booked",
                  id: 1,
                  name: "Dewar-001",
                  history: [{ dewarStatus: "opened", arrivalDate: "2025-01-01T00:00:00Z" }],
                },
              ],
              total: 1,
              limit: 20,
            },
            { status: 200 },
          ),
        { once: true },
      ),
    );

    render(await ReturnRequests(baseShipmentParams));
    expect(screen.getByText("01/01/2025, 00:00:00")).toBeInTheDocument();
  });
});
