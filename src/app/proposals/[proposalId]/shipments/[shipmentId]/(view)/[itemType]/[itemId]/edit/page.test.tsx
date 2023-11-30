import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { HttpResponse, http } from "msw";
import ItemFormPage from "./page";

describe("Item Form Page", () => {
  it("should render child content", async () => {
    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });

  it("should return empty object if no data is available in data fetch", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/data",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });

  it("should render child content", async () => {
    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });
});
