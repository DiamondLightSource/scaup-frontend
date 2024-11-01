import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("should display app version", () => {
    process.env.NEXT_PUBLIC_APP_VERSION = "9.9.9";
    render(Footer());

    expect(screen.getByText("9.9.9")).toBeInTheDocument();
  });
});
