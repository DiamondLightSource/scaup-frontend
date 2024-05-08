import ProposalOverview from "@/app/proposals/[proposalId]/sessions/[visitNumber]/page";
import { server } from "@/mocks/server";
import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";

const baseShipment = { id: 1, proposalReference: "cm00001", name: "", creationDate: "" };
const baseParams = { params: { proposalId: "cm1234", visitNumber: "1" } };

describe("Proposal Page Content", () => {
  it("should display message if proposal is not available", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/shipments",
        () => HttpResponse.json({}, { status: 404 }),
      ),
    );

    render(await ProposalOverview(baseParams));

    expect(screen.getByText("Session Unavailable")).toBeInTheDocument();
  });

  it("should display message if there are no shipments in this proposal", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/shipments",
        () => HttpResponse.json({ items: [] }),
      ),
    );

    render(await ProposalOverview(baseParams));

    expect(
      screen.getByText("This session has no shipments assigned to it yet. You can:"),
    ).toBeInTheDocument();
  });

  it("should display proposal reference in page title", async () => {
    render(await ProposalOverview(baseParams));

    expect(screen.getByText("cm1234-1")).toBeInTheDocument();
  });

  it("should display question mark if creation date is not present", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/shipments",
        () => HttpResponse.json({ items: [{ ...baseShipment, creationDate: null }] }),
      ),
    );

    render(await ProposalOverview(baseParams));
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should display 'submitted' as tag if item is submitted", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/shipments",
        () => HttpResponse.json({ items: [{ ...baseShipment, creationStatus: "submitted" }] }),
      ),
    );

    render(await ProposalOverview(baseParams));
    expect(screen.getByText("Submitted")).toBeInTheDocument();
  });

  it("should display 'draft' as tag if item is not submitted", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/shipments",
        () => HttpResponse.json({ items: [{ ...baseShipment, creationStatus: "draft" }] }),
      ),
    );

    render(await ProposalOverview(baseParams));
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});
