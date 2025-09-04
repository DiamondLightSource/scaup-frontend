import HomePage from "@/app/page";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";

describe("Home Page", () => {
  it("should render page", async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText("Proposals")).toBeInTheDocument();
  });
});
