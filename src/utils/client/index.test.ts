import { server } from "@/mocks/server";
import { waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { createShipmentRequest } from ".";
import { mockSession, toastMock } from "../../../jest.setup";

describe("Shipment Request Creation", () => {
  let originalWindowLocation = window.location;
  let assignMock = jest.fn();

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

  it("should display toast if request fails", async () => {
    server.use(
      http.post("http://localhost/api/shipments/1/request", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );

    expect(createShipmentRequest("1", mockSession));
    await waitFor(() => expect(toastMock).toHaveBeenCalled());
  });

  it("should redirect user if request is successful", async () => {
    expect(createShipmentRequest("1", mockSession));
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SHIPPING_SERVICE_URL}/shipment-requests/20/incoming`,
      ),
    );
  });
});
