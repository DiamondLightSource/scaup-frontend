import { ProposalOverviewContent } from "@/app/proposals/[proposalId]/pageContent";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";

const baseShipment = { id: 1, proposalReference: "cm00001", name: "", creationDate: "" };

describe("Proposal Page Content", () => {
  it("should display message if there are no shipments in this proposal", () => {
    render(<ProposalOverviewContent proposalId='cm1234' data={null} />);

    expect(
      screen.getByText("This proposal has no shipments assigned to it yet. You can:"),
    ).toBeInTheDocument();
  });

  it("should display proposal reference in page title", () => {
    render(<ProposalOverviewContent proposalId='cm1234' data={null} />);

    expect(screen.getByText("cm1234")).toBeInTheDocument();
  });

  it("should display question mark if creation date is not present", () => {
    render(
      <ProposalOverviewContent
        proposalId='cm1234'
        data={[{ ...baseShipment, creationDate: null }]}
      />,
    );

    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should display 'submitted' as tag if item is submitted", () => {
    render(
      <ProposalOverviewContent
        proposalId='cm1234'
        data={[{ ...baseShipment, creationStatus: "submitted" }]}
      />,
    );

    expect(screen.getByText("Submitted")).toBeInTheDocument();
  });

  it("should display 'draft' as tag if item is not submitted", () => {
    render(
      <ProposalOverviewContent
        proposalId='cm1234'
        data={[{ ...baseShipment, creationStatus: "draft" }]}
      />,
    );

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("should redirect to new shipment when created", async () => {
    render(<ProposalOverviewContent proposalId='cm1234' data={null} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "New Name" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(mockRouter.pathname).toBe("/proposals/cm1234/shipments/123/edit"));
  });
});
