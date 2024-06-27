import { server } from "@/mocks/server";
import { createShipmentRequest } from "@/utils/client";
import { HttpResponse, http } from "msw";

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
    await createShipmentRequest("1");
    expect(assignMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/shipments/1/request`,
    );
  });

  it("should display error details if available", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/request",
        () => HttpResponse.json({ detail: "Error Detail" }, { status: 424 }),
        { once: true },
      ),
    );

    expect(async () => {
      await createShipmentRequest("1");
    }).rejects.toThrowError("Error Detail");
  });
});
