import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { toastMock } from "@/../vitest.setup";
import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import SubmissionOverview from "./page";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

vi.mock("next/cache", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    revalidateTag: () => null,
  };
});

describe("Shipment Submission Overview", () => {
  it("should render shipment contents", async () => {
    render(await SubmissionOverview({ params }));

    expect(screen.getByText(/dewar/i)).toBeInTheDocument();
    expect(screen.getByText(/puck/i)).toBeInTheDocument();
    expect(screen.getAllByText(/2/i)).toHaveLength(2);
  });

  it("should display toast if shipment request creation fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/request",
        () => HttpResponse.json({}, { status: 424 }),
        { once: true },
      ),
    );

    render(await SubmissionOverview({ params }));

    fireEvent.click(screen.getByText(/arrange shipping/i));
    fireEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({
        status: "error",
        title: "Unable to create shipment request",
      }),
    );
  });

  it("should display warning if shipment contents are 'locked'", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () =>
          HttpResponse.json({ ...defaultData, data: { shipmentRequest: 123 } }, { status: 200 }),
        { once: true },
      ),
    );

    render(await SubmissionOverview({ params }));

    expect(screen.getByText(/view shipping information/i)).toBeInTheDocument();
    expect(screen.getByText(/the shipping process has already been started/i)).toBeInTheDocument();
  });
});
