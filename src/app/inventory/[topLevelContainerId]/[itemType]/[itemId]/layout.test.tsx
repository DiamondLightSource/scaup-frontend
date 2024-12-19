import { server } from "@/mocks/server";
import { renderWithProviders, wrapInPromise } from "@/utils/test-utils";
import { HttpResponse, http } from "msw";
import InventoryLayout from "./layout";
import { screen } from "@testing-library/react";

const params = wrapInPromise({ itemType: "", itemId: "", topLevelContainerId: "1" });

describe("Inventory Layout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render child content", async () => {
    renderWithProviders(await InventoryLayout({ children: <></>, params }));
  });

  it("should redirect to previous page if shipments data item request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/internal-containers/unassigned",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await InventoryLayout({ children: <></>, params }));

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

    renderWithProviders(await InventoryLayout({ children: <></>, params }));
    expect(screen.getByText("Return to inventory page")).toBeInTheDocument();
  });
});
