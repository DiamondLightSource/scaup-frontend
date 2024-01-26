import { waitFor } from "@testing-library/react";
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

  it("should redirect user if request is successful", async () => {
    expect(createShipmentRequest("1"));
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/1/request`,
      ),
    );
  });
});
