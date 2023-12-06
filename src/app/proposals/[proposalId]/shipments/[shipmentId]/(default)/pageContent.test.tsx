import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import ShipmentHomeContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };

describe("Shipment Submission Overview", () => {
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

  it("should not display 'edit shipment' button if shipment is already booked", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{ samples: [], counts: {}, dispatch: { status: "Booked" }, name: "" }}
      />,
    );

    expect(screen.queryByText(/edit shipment/i)).not.toBeInTheDocument();
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
