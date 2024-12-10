import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import ReviewPage from "./page";

describe("Review Page", () => {
  it("should render page", async () => {
    renderWithProviders(await ReviewPage({ params: { shipmentId: "1", proposalId: "1" } }));

    expect(
      screen.getByText(/you can still edit your sample collection after submitting/i),
    ).toBeInTheDocument();
  });
});
