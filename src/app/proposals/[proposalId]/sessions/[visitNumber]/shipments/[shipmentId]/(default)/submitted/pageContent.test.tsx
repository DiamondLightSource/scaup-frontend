import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import { ShippingInstructions } from "./pageContent";

const params = {
  proposalId: "cm1",
  visitNumber: "1",
  shipmentId: "1",
};

describe("Shipping Instructions", () => {
  it("should select 'yes' for shipping through Diamond if already booked", async () => {
    render(<ShippingInstructions params={params} isBooked={true} />);

    expect(screen.getByText("Yes")).toHaveAttribute("data-checked");
  });

  it("should display label printing instructions if 'no' is selected", async () => {
    render(<ShippingInstructions params={params} isBooked={false} />);

    fireEvent.click(screen.getByText("No"));
    expect(screen.getByText("Print Tracking Labels")).toBeInTheDocument();
  });

  it("should display toast if shipment request creation fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/request",
        () => HttpResponse.json({}, { status: 424 }),
        { once: true },
      ),
    );

    render(<ShippingInstructions params={params} isBooked={false} />);

    fireEvent.click(screen.getByText("Yes"));
    fireEvent.click(screen.getByText("Arrange Shipping"));
    fireEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({
        status: "error",
        title: "Unable to create shipment request",
      }),
    );
  });
});
