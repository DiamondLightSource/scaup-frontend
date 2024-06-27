import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import PreSession from "./page";

const params = { shipmentId: "1", proposalId: "1", visitNumber: "1" };

describe("Pre-Session Page", () => {
  it("should render page", async () => {
    renderWithProviders(await PreSession({ params }));

    expect(screen.getByText(/grid information/i)).toBeInTheDocument();
  });
});
