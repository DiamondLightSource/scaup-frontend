import { server } from "@/mocks/server";
import { renderWithProviders, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ImportSamplesPageContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Import Samples Page Content", () => {
  it("should render samples", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("sample-in-session");
  });

  it("should not allow invalid session references", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "invalidname" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("Session number is invalid");
  });

  it("should enable continue button if samples are selected", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);

    expect(screen.getByText("Save and enter pre-session information")).not.toHaveAttribute(
      "disabled",
    );
  });

  it("should display message if no grids are available", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/samples",
        () => HttpResponse.json({ items: [] }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("No grids available for transfer in this session.");
  });

  it("should disable checkbox if sample has already been imported", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/samples",
        () =>
          HttpResponse.json({
            items: [
              {
                id: 1,
                name: "sample-in-session",
                parentShipmentName: "test-shipment",
                data: { type: "sample" },
                derivedSamples: [{}],
              },
            ],
          }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    const sample = await screen.findByRole("checkbox");
    expect(sample).toHaveAttribute("disabled");
  });

  it("should display message if samples GET request fails", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/samples",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("No grids available for transfer in this session.");
  });

  it("should redirect to pre-session page if 'Save and enter pre-session information' is clicked", async () => {
    mockRouter.setCurrentUrl("shipments/1/import-samples");
    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("Save and enter pre-session information"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/pre-session"));
  });

  it("should display shipment name as tag", async () => {
    mockRouter.setCurrentUrl("shipments/1/import-samples");
    renderWithProviders(<ImportSamplesPageContent params={params} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("test-shipment");
  });
});
