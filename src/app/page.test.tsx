import HomePage from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("Home Page", () => {
  it("should render page", async () => {
    render(await HomePage());

    expect(screen.getByText("Proposals")).toBeInTheDocument();
  });

  it("should display number of sample collections for sessions", async () => {
    render(await HomePage());

    expect(screen.getAllByText(/sample collections:/i)).toHaveLength(2);
    expect(screen.getAllByText("2")).toHaveLength(2);
  });
});
