import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { HttpResponse, http } from "msw";
import ShipmentsLayout from "@/app/proposals/[proposalId]/sessions/[visitNumber]/shipments/[shipmentId]/(view)/layout";

const defaultParams = { shipmentId: "1", proposalId: "1", visitNumber: "1" };

describe("Shipment Layout", () => {
  it("should render child content", async () => {
    renderWithProviders(await ShipmentsLayout({ children: <></>, params: defaultParams }));
  });

  it("should return null if no shipment details are available in data fetch", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ShipmentsLayout({ children: <></>, params: defaultParams }));
  });

  it("should return null if no unassigned items are available (with suffix) in data fetch", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ShipmentsLayout({ children: <></>, params: defaultParams }));
  });
});
