import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { rest } from "msw";
import ItemFormPage, { getPrepopData } from "./page";

describe("Item Form Page", () => {
  it("should render child content", async () => {
    renderWithProviders(await ItemFormPage({ params: { shipmentId: "1", proposalId: "1" } }));
  });
});

describe("Item Form Page Data", () => {
  it("should return empty object if no data is available", async () => {
    server.use(
      rest.get("http://localhost/api/proposals/:proposalReference/data", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    expect(await getPrepopData("1")).toEqual({});
  });
});
