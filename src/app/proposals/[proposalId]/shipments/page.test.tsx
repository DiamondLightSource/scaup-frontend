import ProposalShipmentsPage from "@/app/proposals/[proposalId]/shipments/page";
import { server } from "@/mocks/server";
import { baseSessionParams } from "@/utils/test-utils";
import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";

const baseShipment = { proposalReference: "cm00001" };

describe("Proposal Sample Collections", () => {
  it("should display proposal sample collections", async () => {
    render(await ProposalShipmentsPage(baseSessionParams));

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should display message if there are no sample collections in this proposal", async () => {
    server.use(
      http.get("http://localhost/api/proposals/:proposalReference/shipments", () =>
        HttpResponse.json({ items: [] }, { status: 200 }),
      ),
    );

    render(await ProposalShipmentsPage(baseSessionParams));

    expect(screen.getByText("No shipments found")).toBeInTheDocument();
  });

  it("should display message if request fails", async () => {
    server.use(
      http.get("http://localhost/api/proposals/:proposalReference/shipments", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );

    render(await ProposalShipmentsPage(baseSessionParams));

    expect(screen.getByText("No shipments found")).toBeInTheDocument();
  });
});
