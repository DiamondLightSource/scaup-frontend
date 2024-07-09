import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { getCurrentStepIndex } from "@/mappings/pages";
import { renderWithProviders, sample, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import ShipmentLayoutContent from "./layoutContent";

const defaultParams = { proposalId: "cm0001", shipmentId: "new" };
const defaultShipmentItems: TreeData[] = [
  { id: "dewar-1", name: "dewar-1", data: { type: "dewar" } },
];

const baseUnassigned = { samples: [], containers: [], gridBoxes: [] };

const defaultUnassigned = structuredClone(initialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("sample")].children!.push(sample);

describe("Shipment Layout", () => {
  it("should render proposal name as heading", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={defaultParams}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    const proposalHeading = screen.getByRole("heading", {
      name: /cm0001/i,
    });

    expect(proposalHeading).toBeInTheDocument();
  });

  it("should update path if active item changes", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    expect(mockRouter.pathname).toBe("/");

    fireEvent.click(screen.getByLabelText(/view/i));

    expect(mockRouter.pathname).toBe("/dewar/dewar-1/edit");
  });

  it("should remove item from overview if remove clicked", async () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /remove/i,
      }),
    );

    await waitFor(() => expect(screen.queryByText(/dewar-1/i)).not.toBeInTheDocument());
  });

  it("should clear unassigned items if passed prop is null", () => {
    const { store } = renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={null}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      { preloadedState: { shipment: { ...testInitialState, unassigned: defaultUnassigned } } },
    );

    expect(
      store.getState().shipment.unassigned[0].children![getCurrentStepIndex("sample")].children,
    ).toEqual([]);
  });

  it("should render unassigned items provided by prop", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={{
          ...baseUnassigned,
          gridBoxes: [{ data: { type: "gridBox" }, id: 1, name: "Grid Box 01" }],
        }}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    expect(screen.getByText("Grid Box 01")).toBeInTheDocument();
  });
});
