import { TreeData } from "@/components/visualisation/treeView";
import { steps } from "@/mappings/pages";
import { renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import ShipmentLayoutContent from "./layoutContent";

const defaultParams = { proposalId: "cm0001", shipmentId: "new" };
const defaultShipmentItems: TreeData = {
  id: "",
  name: "",
  data: { type: "dewar" },
  children: [{ id: "dewar-1", name: "dewar-1", data: { type: "dewar" } }],
};

const baseUnassigned = { samples: [], containers: [], gridBoxes: [] };

describe("Shipment Layout", () => {
  it("should render steps", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={defaultParams}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    expect(screen.getByLabelText("Samples Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Grid Boxes Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Containers Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Dewars Step")).toBeInTheDocument();
  });

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

  it("should display 'continue' button in overview on all steps but last", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    const continueButton = screen.getByRole("button", {
      name: /continue/i,
    });

    expect(continueButton).toBeInTheDocument();
  });

  it("should redirect user to review page if finish is clicked", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: { ...testInitialState.activeItem, data: { type: "dewar" } },
            items: [testInitialState.activeItem],
          },
        },
      },
    );

    const finishButton = screen.getByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

    expect(mockRouter.pathname).toBe("/sample/new-sample/review");
  });

  it("should redirect user to successful submission page after submitting", async () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            currentStep: steps.length,
          },
        },
      },
    );

    const finishButton = screen.getByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

    await waitFor(() => expect(mockRouter.pathname).toBe("/submitted"));
  });

  it("should display 'finish' button in overview on last step", async () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: { ...testInitialState.activeItem, data: { type: "dewar" } },
          },
        },
      },
    );

    await screen.findByText("Overview");

    const finishButton = await screen.findByRole("button", {
      name: /finish/i,
    });

    expect(finishButton).toBeInTheDocument();
  });

  it("should navigate to corresponding step when step is clicked", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={defaultParams}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    fireEvent.click(screen.getByLabelText("Grid Boxes Step"));

    expect(mockRouter.pathname).toBe("/gridBox/new/edit");
  });

  it("should navigate to first subtype if current step type is overloaded with array of subtypes", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={defaultParams}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    fireEvent.click(screen.getByLabelText("Containers Step"));

    expect(mockRouter.pathname).toBe("/puck/new/edit");
  });

  it("should match current step to current path", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={null}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            items: [],
            activeItem: { ...testInitialState.activeItem, data: { type: "dewar" } },
          },
        },
      },
    );

    const stepHeading = screen.getAllByRole("heading", {
      name: /dewars/i,
    });

    expect(stepHeading[0]).toHaveAttribute("data-status", "active");
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

    expect(mockRouter.pathname).toBe("/puck/new/edit");

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

    const stepHeading = screen.getAllByRole("heading", {
      name: /dewars/i,
    });

    expect(stepHeading[0]).toHaveAttribute("data-status", "incomplete");

    fireEvent.click(
      screen.getByRole("button", {
        name: /remove/i,
      }),
    );

    await waitFor(() => expect(screen.queryByText(/dewar-1/i)).not.toBeInTheDocument());
  });

  it("should not update current step if previous step is greater than final step", () => {
    const { store } = renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            currentStep: 5,
          },
        },
      },
    );

    const stepHeading = screen.getAllByRole("heading", {
      name: /dewars/i,
    });

    fireEvent.click(stepHeading[0]);

    expect(store.getState().shipment.currentStep).toBe(5);
  });

  it("should enter edit mode if edit clicked in review page", () => {
    const { store } = renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            currentStep: 5,
          },
        },
      },
    );

    const editButton = screen.getByRole("button", {
      name: /edit/i,
    });

    fireEvent.click(editButton);

    expect(store.getState().shipment.currentStep).toBe(0);
  });

  it("should move to next step if continue clicked", async () => {
    const { store } = renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={baseUnassigned}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    const editButton = screen.getByRole("button", {
      name: /continue/i,
    });

    fireEvent.click(editButton);

    expect(mockRouter.pathname).toBe("/gridBox/new/edit");
  });

  it("should render unassigned items provided by prop", () => {
    const { store } = renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={{
          ...baseUnassigned,
          gridBoxes: [{ data: { type: "gridBox" }, id: "gridBox", name: "Grid Box 01" }],
        }}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
    );

    expect(screen.getByText("Grid Box 01")).toBeInTheDocument();
  });

  it("should not let user click finish if there are unassigned items", () => {
    renderWithProviders(
      <ShipmentLayoutContent
        shipmentData={defaultShipmentItems}
        unassignedItems={{
          ...baseUnassigned,
          gridBoxes: [{ data: { type: "gridBox" }, id: "gridBox", name: "Grid Box 01" }],
        }}
        params={{ ...defaultParams }}
      >
        <></>
      </ShipmentLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: { ...testInitialState.activeItem, data: { type: "dewar" } },
          },
        },
      },
    );

    expect(
      screen.getByText("Cannot progress without assigning all items to a container!"),
    ).toBeInTheDocument();
  });
});
