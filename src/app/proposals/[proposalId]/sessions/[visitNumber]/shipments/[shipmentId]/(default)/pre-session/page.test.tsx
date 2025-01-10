import { baseShipmentParams, renderWithProviders, wrapInPromise } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import PreSession from "./page";

const props = { ...baseShipmentParams, searchParams: wrapInPromise({ skipPush: true }) };

describe("Pre-Session Page", () => {
  it("should render page", async () => {
    renderWithProviders(await PreSession(props));

    expect(screen.getByText(/grid information/i)).toBeInTheDocument();
  });
});
