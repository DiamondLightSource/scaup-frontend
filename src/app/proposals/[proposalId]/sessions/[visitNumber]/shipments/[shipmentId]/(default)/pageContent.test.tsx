import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ShipmentHomeContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

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
          samples: [
            {
              name: "C01",
              id: 1,
              location: 1,
              shipmentId: 1,
              proteinId: 1,
              containerId: 1,
              type: "sample",
            },
          ],
          counts: {},
          dispatch: {},
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getByText("C01")).toBeInTheDocument();
  });

  it("should direct user to sample page if sample clicked", async () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [
            {
              name: "C01",
              id: 1,
              location: 1,
              shipmentId: 1,
              proteinId: 1,
              containerId: 1,
              type: "sample",
            },
          ],
          counts: {},
          dispatch: {},
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
      />,
    );

    fireEvent.click(screen.getByText("C01"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/1/sample/1/review"));
  });

  it("should not enable 'edit shipment' button if shipment is already booked", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getAllByRole("group")[0]).toHaveAttribute("aria-disabled", "true");
  });

  it("should display 'edit booking' button if shipment is already booked", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getByText(/edit booking/i)).toBeInTheDocument();
  });

  it("should not enable 'print pre-session' button if no pre-session data is available", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getAllByRole("group")[4]).toHaveAttribute("aria-disabled", "true");
  });

  it("should render cassette if user is staff", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={true}
      />,
    );

    expect(screen.getByText(/cassette/i)).toBeInTheDocument();
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
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
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
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
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
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        isStaff={false}
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

  it("should display pre-session data if available", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: { details: { pixelSize: 150 } },
          hasUnassigned: false,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getByText("Pixel Size")).toBeInTheDocument();
  });

  it("should display pre-session data if available", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: { details: { pixelSize: 150 } },
          hasUnassigned: true,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getAllByRole("group")[1]).toHaveAttribute("aria-disabled", "true");
  });
});
