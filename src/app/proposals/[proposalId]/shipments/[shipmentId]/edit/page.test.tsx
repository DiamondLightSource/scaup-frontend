import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { rest } from "msw";
import ItemFormPage from "./page";

describe("Item Form Page", () => {
  it("should render child content", async () => {
    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });

  it("should return empty object if no data is available in data fetch", async () => {
    server.use(
      rest.get("http://localhost/api/proposals/:proposalReference/data", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });

  it("should render child content", async () => {
    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });
});
