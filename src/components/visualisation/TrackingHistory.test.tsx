import { render, screen } from "@testing-library/react";

import { TrackingHistory } from "./TrackingHistory";

describe("Sample Collection Overview", () => {
  it("should display dewar history", async () => {
    render(
      <TrackingHistory
        history={[
          {
            dewarId: 1,
            storageLocation: "m01",
            dewarStatus: "opened",
            arrivalDate: "2025-01-01T00:00:00Z",
          },
        ]}
      />,
    );
    expect(screen.getByText(/opened/i)).toBeInTheDocument();
    expect(screen.getByText("m01 - 01/01/2025, 00:00:00")).toBeInTheDocument();
  });

  it("should display message if no dewar history is available", async () => {
    render(<TrackingHistory history={null} />);
    expect(screen.getByText("No history found for this dewar")).toBeInTheDocument();
  });

  it("should only display date for history step if no storage location is available", async () => {
    render(
      <TrackingHistory
        history={[{ dewarId: 1, dewarStatus: "opened", arrivalDate: "2025-01-01T00:00:00Z" }]}
      />,
    );
    expect(screen.getByText("01/01/2025, 00:00:00")).toBeInTheDocument();
  });
});
