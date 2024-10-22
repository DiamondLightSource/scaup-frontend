import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
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
