import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ImportSamplesPageContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Import Samples Page Content", () => {
  it("should render samples", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("sample-in-session");
  });

  it("should not allow invalid session references", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "invalidname" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("Session number is invalid");
  });

  it("should enable continue button if samples are selected", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);

    expect(screen.getByText("Save and continue editing")).not.toHaveAttribute("disabled");
  });

  it("should display message if no samples are available", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/samples",
        () => HttpResponse.json({ items: [] }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("No samples available for transfer in this session.");
  });

  it("should display message if samples GET request fails", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/samples",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    await screen.findByText("No samples available for transfer in this session.");
  });

  it("should redirect to pre-session page if shipment is new", async () => {
    mockRouter.setCurrentUrl("shipments/1/import-samples");
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={true} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("skip to entering pre-session information"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/pre-session"));
  });

  it("should redirect to shipment page if 'Save and continue editing' is clicked", async () => {
    mockRouter.setCurrentUrl("shipments/1/import-samples");
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={true} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Select"));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("Save and continue editing"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/gridBox/new/edit"));
  });
});
