import { render, screen } from "@testing-library/react";
import BookingAndLabelsPage from "./page";
import { baseShipmentParams } from "@/utils/test-utils";

describe("Booking and Labels Page", () => {
  it("should direct user to sample page if sample clicked", async () => {
    render(await BookingAndLabelsPage(baseShipmentParams));

    expect(screen.getByText("Print Tracking Labels")).toHaveAttribute(
      "href",
      "http://localhost/api/shipments/1/tracking-labels",
    );
  });

  it("should direct user to returns page if returns link clicked", async () => {
    render(await BookingAndLabelsPage(baseShipmentParams));

    expect(screen.getByText(/request for your dewars/i)).toHaveAttribute("href", "dewar-logistics");
  });
});
