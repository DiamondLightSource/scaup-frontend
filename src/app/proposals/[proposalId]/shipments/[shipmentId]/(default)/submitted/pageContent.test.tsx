import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";

import SubmissionOverviewContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };

describe("Shipment Submission Overview", () => {
  it("should render shipment contents", () => {
    renderWithProviders(
      <SubmissionOverviewContent
        data={{
          counts: { dewar: 1, puck: 5 },
          formModel: [
            { label: "Dewars", id: "dewar", type: "text" },
            { label: "Pucks", id: "puck", type: "text" },
          ],
        }}
        params={params}
      />,
    );

    expect(screen.getByText(/dewars/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });
});
