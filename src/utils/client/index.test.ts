import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { createShipmentRequest } from ".";

describe("Shipment Request Creation", () => {
  let originalWindowLocation = window.location;
  let assignMock = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: { assign: assignMock },
    });
  });

  afterEach(() => {
    assignMock.mockClear();

    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
  });

  it.skip("should display toast if request fails", async () => {
    server.use(
      http.post("http://localhost/api/shipments/1/request", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );

    createShipmentRequest("1");
    await waitFor(() => expect(toastMock).toHaveBeenCalled());
  });

  it("should redirect user if request is successful", async () => {
    expect(createShipmentRequest("1"));
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_SHIPPING_SERVICE_URL}/shipment-requests/20/incoming`,
      ),
    );
  });
});
