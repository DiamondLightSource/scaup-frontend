import InventoryPage from "@/app/inventory/page";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";

describe("Inventory Page", () => {
  it("should display message if there are no internal containers", async () => {
    server.use(
      http.get(
        "http://localhost/api/internal-containers",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await InventoryPage());

    expect(
      screen.getByText("There are no containers in the inventory yet. You can:"),
    ).toBeInTheDocument();
  });

  it("should display message if user is not allowed to view page", async () => {
    server.use(
      http.get(
        "http://localhost/api/internal-containers",
        () => HttpResponse.json({}, { status: 403 }),
        { once: true },
      ),
    );

    renderWithProviders(await InventoryPage());

    expect(screen.getByText("You do not have permission to view this page.")).toBeInTheDocument();
  });

  it("should display existing inventory items", async () => {
    renderWithProviders(await InventoryPage());

    expect(screen.getByText("Container")).toBeInTheDocument();
  });
});
