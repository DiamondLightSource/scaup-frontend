import { render, screen } from "@testing-library/react";
import BookingAndLabelsPage from "./page";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Booking and Labels Page", () => {
  it("should direct user to sample page if sample clicked", async () => {
    render(await BookingAndLabelsPage({ params }));

    expect(screen.getByText("Print Tracking Labels")).toHaveAttribute(
      "href",
      "http://localhost/api/shipments/1/tracking-labels",
    );
  });

  it("should direct user to returns page if returns link clicked", async () => {
    render(await BookingAndLabelsPage({ params }));

    expect(screen.getByText(/request for your dewars/i)).toHaveAttribute("href", "returns");
  });
});
