import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { rest } from "msw";
import ShipmentsLayout, { getShipmentData } from "./layout";

describe("Shipment Layout", () => {
  it("should render child content", async () => {
    renderWithProviders(
      await ShipmentsLayout({ children: <></>, params: { shipmentId: "1", proposalId: "1" } }),
    );
  });
});

describe("Shipment Layout Data", () => {
  it("should return null if no shipment details are available", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    expect(await getShipmentData("1")).toBe(null);
  });

  it("should return null if no unassigned items are available (with suffix)", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    expect(await getShipmentData("1", "/unassigned")).toBe(null);
  });
});
