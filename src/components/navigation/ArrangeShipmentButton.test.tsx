import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { ArrangeShipmentButton } from "@/components/navigation/ArrangeShipmentButton";
import mockRouter from "next-router-mock";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Arrange Shipment Button", () => {
  it("should display 'edit booking' button if shipment is already booked", () => {
    render(<ArrangeShipmentButton params={params} isBooked />);

    expect(screen.getByText(/view shipping information/i)).toBeInTheDocument();
  });

  it("should redirect user to shipping service if 'edit booking' is clicked", async () => {
    render(<ArrangeShipmentButton params={params} isBooked />);

    fireEvent.click(screen.getByText(/view shipping information/i));
    await waitFor(() => expect(mockRouter.pathname).toBe("/api/shipments/1/request"));
  });

  it("should redirect user to shipping service if 'create booking' is clicked", async () => {
    render(<ArrangeShipmentButton params={params} />);

    fireEvent.click(screen.getByText(/arrange shipping/i));
    fireEvent.click(screen.getByText(/continue/i));
    await waitFor(() => expect(mockRouter.pathname).toBe("/api/shipments/1/request"));
  });

  it("should display toast if shipment request creation fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/request",
        () => HttpResponse.json({}, { status: 424 }),
        { once: true },
      ),
    );

    render(<ArrangeShipmentButton params={params} />);

    fireEvent.click(screen.getByText(/arrange shipping/i));
    fireEvent.click(screen.getByText(/continue/i));

    await waitFor(() => expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument());
    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({
        status: "error",
        title: "Unable to create shipment request",
      }),
    );
  });
});
