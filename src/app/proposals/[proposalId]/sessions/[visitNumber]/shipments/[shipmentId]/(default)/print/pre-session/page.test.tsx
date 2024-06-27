import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import PreSession from "./page";

const params = { shipmentId: "1", proposalId: "1", visitNumber: "1" };

describe("Pre-Session Printable Page", () => {
  it("should render pre-session information", async () => {
    renderWithProviders(await PreSession({ params }));

    expect(screen.getByText(/pixel size/i)).toBeInTheDocument();
  });

  it("should render message if no pre-session data is available", async () => {
    server.use(
      http.get("http://localhost/api/shipments/:shipmentId/preSession", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );

    renderWithProviders(await PreSession({ params }));

    expect(screen.getByText(/no pre-session information available/i)).toBeInTheDocument();
  });
});
