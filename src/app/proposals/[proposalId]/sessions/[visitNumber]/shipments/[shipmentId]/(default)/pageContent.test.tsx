import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import ShipmentHomeContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Sample Collection Submission Overview", () => {
  it("should not enable 'edit sample collection' button if shipment is already booked", () => {
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

  it("should render sample collection samples", () => {
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

  it("should display link to data collection group if available", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [
            {
              id: 1,
              name: "sample-test",
              type: "grid",
              shipmentId: 1,
              proteinId: 1,
              dataCollectionGroupId: 1,
            },
          ],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: { details: { pixelSize: 150 } },
          hasUnassigned: true,
        }}
        isStaff={false}
      />,
    );

    expect(screen.getByText("View Data")).toBeInTheDocument();
  });

  it("should disable booking and labels link if no dewars are present in the sample collection", () => {
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
