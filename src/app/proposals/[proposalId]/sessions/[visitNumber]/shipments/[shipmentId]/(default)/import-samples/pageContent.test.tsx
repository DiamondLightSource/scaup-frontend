import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ImportSamplesPageContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Import Samples Page Content", () => {
  let originalWindowLocation = window.location;
  let assignMock = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: { assign: assignMock },
    });
  });

  afterEach(() => {
    assignMock.mockClear();

    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
  });

  it("should render containers", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("Container");
  });

  it("should not allow invalid session references", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "invalidname" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("Session number is invalid");
  });

  it("should enable continue button if samples are selected", async () => {
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);

    expect(screen.getByRole("button", { name: "Finish" })).not.toHaveAttribute("disabled");
  });

  it("should display message if no samples are available", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/containers",
        () => HttpResponse.json({ items: [] }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("No containers available for transfer in this session.");
  });

  it("should display message if containers GET request fails", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/containers",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("No containers available for transfer in this session.");
  });

  it("should redirect to shipments page if shipment is not new", async () => {
    const assignSpy = vi.spyOn(window.location, "assign");
    mockRouter.setCurrentUrl("shipments/1/import-samples");
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={false} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole("button", { name: "Finish" }));

    await waitFor(() => expect(assignMock).toBeCalledWith("./"));
  });

  it("should redirect to pre-session page if shipment is new", async () => {
    mockRouter.setCurrentUrl("shipments/1/import-samples");
    renderWithProviders(<ImportSamplesPageContent params={params} isNew={true} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => expect(assignMock).toBeCalledWith("pre-session"));
  });
});
