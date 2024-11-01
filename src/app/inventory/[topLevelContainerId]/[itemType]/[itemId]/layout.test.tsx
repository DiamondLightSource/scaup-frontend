import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { HttpResponse, http } from "msw";
import InventoryLayout from "./layout";
import { fireEvent, screen } from "@testing-library/react";

const defaultParams = { itemType: "", itemId: "", topLevelContainerId: "1" };

describe("Shipment Layout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render child content", async () => {
    renderWithProviders(await InventoryLayout({ children: <></>, params: defaultParams }));
  });

  it("should redirect to previous page if shipments data item request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/internal-containers/unassigned",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await InventoryLayout({ children: <></>, params: defaultParams }));

    expect(screen.getByText("Return to inventory page")).toBeInTheDocument();
  });

  it("should redirect to previous page if unassigned item request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/internal-containers/1",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await InventoryLayout({ children: <></>, params: defaultParams }));
    expect(screen.getByText("Return to inventory page")).toBeInTheDocument();
  });
});
