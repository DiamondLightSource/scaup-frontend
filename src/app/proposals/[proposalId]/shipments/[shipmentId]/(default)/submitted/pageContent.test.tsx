import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import SubmissionOverviewContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };

describe("Shipment Submission Overview", () => {
  it("should render shipment contents", () => {
    renderWithProviders(
      <SubmissionOverviewContent
        data={{
          counts: { dewar: 1, puck: 5 },
          formModel: [
            { label: "Dewars", id: "dewar", type: "text" },
            { label: "Pucks", id: "puck", type: "text" },
          ],
          isBooked: false,
        }}
        params={params}
      />,
    );

    expect(screen.getByText(/dewars/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it("should display toast if shipment request creation fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/request",
        () => HttpResponse.json({}, { status: 424 }),
        { once: true },
      ),
    );

    renderWithProviders(
      <SubmissionOverviewContent
        data={{
          counts: { dewar: 1, puck: 5 },
          formModel: [
            { label: "Dewars", id: "dewar", type: "text" },
            { label: "Pucks", id: "puck", type: "text" },
          ],
          isBooked: false,
        }}
        params={params}
      />,
    );

    fireEvent.click(screen.getByText(/arrange shipping/i));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({
        status: "error",
        title: "Unable to create shipment request",
      }),
    );
  });

  it("should display warning if shipment contents are 'locked'", () => {
    renderWithProviders(
      <SubmissionOverviewContent
        data={{
          counts: { dewar: 1, puck: 5 },
          formModel: [
            { label: "Dewars", id: "dewar", type: "text" },
            { label: "Pucks", id: "puck", type: "text" },
          ],
          isBooked: true,
        }}
        params={params}
      />,
    );

    expect(screen.getByText(/view shipping information/i)).toBeInTheDocument();
    expect(screen.getByText(/the shipping process has already been started/i)).toBeInTheDocument();
  });
});
