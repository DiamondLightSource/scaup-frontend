import { render, screen } from "@testing-library/react";

import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import ReturnRequests from "./page";
import { baseShipmentParams } from "@/utils/test-utils";

describe("Return Requests", () => {
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
});
