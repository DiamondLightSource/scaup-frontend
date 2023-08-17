import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ProposalOverviewContent } from "./pageContent";

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
    render(<ProposalOverviewContent proposalId='cm1234' data={[{ shippingId: 1 }]} />);

    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
