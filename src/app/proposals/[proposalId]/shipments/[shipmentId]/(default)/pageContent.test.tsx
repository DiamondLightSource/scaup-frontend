import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import ShipmentHomeContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };

describe("Shipment Submission Overview", () => {
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

  it("should render shipment samples", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [{ macromolecule: "Proteinase K", status: "Data Collected", name: "C01" }],
          counts: {},
          dispatch: {},
          name: "",
        }}
      />,
    );

    expect(screen.getByText(/data collected/i)).toBeInTheDocument();
  });

  it("should render shipment status", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{ samples: [], counts: {}, dispatch: { status: "Booked" }, name: "" }}
      />,
    );

    expect(screen.getByText(/booked/i)).toBeInTheDocument();
  });

  it("should not enable 'edit shipment' button if shipment is already booked", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{ samples: [], counts: {}, dispatch: { status: "Booked" }, name: "" }}
      />,
    );

    expect(screen.getAllByRole("group")[0]).toHaveAttribute("aria-disabled", "true");
  });

  it("should display 'edit booking' button if shipment is already booked", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{ samples: [], counts: {}, dispatch: { status: "Booked" }, name: "" }}
      />,
    );

    expect(screen.getByText(/edit booking/i)).toBeInTheDocument();
  });

  it("should redirect user to shipping service if 'edit booking' is clicked", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked", shipmentRequest: 99 },
          name: "",
        }}
      />,
    );

    fireEvent.click(screen.getByText(/edit booking/i));
    expect(assignMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/shipments/1/request`,
    );
  });

  it("should redirect user to shipping service if 'create booking' is clicked", async () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Created" },
          name: "",
        }}
      />,
    );

    fireEvent.click(screen.getByText(/create booking/i));
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/1/request`,
      ),
    );
  });

  it("should display toast if shipment request creation fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/request",
        () => HttpResponse.json({}, { status: 424 }),
        { once: true },
      ),
    );

    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Created" },
          name: "",
        }}
      />,
    );

    fireEvent.click(screen.getByText(/create booking/i));
    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({
        status: "error",
        title: "Unable to create shipment request",
      }),
    );
  });

  it("should render item quantities", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{ samples: [], counts: { "Grid Box": 5 }, dispatch: {}, name: "" }}
      />,
    );

    expect(screen.getByText(/grid box/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
