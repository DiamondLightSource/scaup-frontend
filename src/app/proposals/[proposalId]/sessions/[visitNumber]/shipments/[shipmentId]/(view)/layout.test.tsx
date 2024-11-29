import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { HttpResponse, http } from "msw";
import ShipmentsLayout from "@/app/proposals/[proposalId]/sessions/[visitNumber]/shipments/[shipmentId]/(view)/layout";
import { redirect } from "next/navigation";

const defaultParams = { shipmentId: "1", proposalId: "1", visitNumber: "1" };

describe("Sample Collection Layout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render child content", async () => {
    renderWithProviders(await ShipmentsLayout({ children: <></>, params: defaultParams }));
  });

  it("should redirect to previous page if shipments data item request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ShipmentsLayout({ children: <></>, params: defaultParams }));
    expect(redirect).toHaveBeenCalledOnce();
  });

  it("should redirect to previous page if unassigned item request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ShipmentsLayout({ children: <></>, params: defaultParams }));

    expect(redirect).toHaveBeenCalledOnce();
  });
});
