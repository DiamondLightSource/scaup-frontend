import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { toastMock } from "@/../vitest.setup";
import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import SubmissionOverview from "./page";
import { baseShipmentParams } from "@/utils/test-utils";

describe("Sample Collection Submission Overview", () => {
  it("should render shipment contents", async () => {
    render(await SubmissionOverview(baseShipmentParams));

    expect(screen.getByText("Dewar")).toBeInTheDocument();
    expect(screen.getByText(/puck/i)).toBeInTheDocument();
    expect(screen.getAllByText(/2/i)).toHaveLength(2);
  });

  it("should display warning if shipment contents are 'locked'", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ ...defaultData, data: { shipmentRequest: 123 } }),
        { once: true },
      ),
    );

    render(await SubmissionOverview(baseShipmentParams));

    expect(screen.getByText(/view shipping information/i)).toBeInTheDocument();
    expect(screen.getByText(/the shipping process has already been started/i)).toBeInTheDocument();
  });

  it("should display message if sample collection does not exist", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    render(await SubmissionOverview(baseShipmentParams));

    expect(screen.getByText(/sample collection unavailable/i)).toBeInTheDocument();
  });
});
