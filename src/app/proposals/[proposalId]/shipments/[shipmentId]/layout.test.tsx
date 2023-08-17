import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import ShipmentLayout from "./layout";

const defaultParams = { proposalId: "cm0001", shipmentId: "new" };
const defaultShipmentItems: TreeData[] = [
  { id: "dewar-1", label: "dewar-1", data: { type: "dewar" } },
];

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: () => ({ data: { accessToken: "abc" } }),
}));

describe("Shipment Layout", () => {
  it("should render steps", () => {
    renderWithProviders(
      <ShipmentLayout params={defaultParams}>
        <></>
      </ShipmentLayout>,
    );

    expect(screen.getByLabelText("Samples Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Grid Boxes Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Containers Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Dewars Step")).toBeInTheDocument();
  });

  it("should render proposal name as heading", () => {
    renderWithProviders(
      <ShipmentLayout params={defaultParams}>
        <></>
      </ShipmentLayout>,
    );

    const proposalHeading = screen.getByRole("heading", {
      name: /cm0001/i,
    });

    expect(proposalHeading).toBeInTheDocument();
  });

  it("should display 'continue' button in overview on all steps but last", () => {
    renderWithProviders(
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
    );

    const continueButton = screen.getByRole("button", {
      name: /continue/i,
    });

    expect(continueButton).toBeInTheDocument();
  });

  it("should display 'finish' button in overview on last step", async () => {
    renderWithProviders(
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: [],
            activeItem: { ...initialState.activeItem, data: { type: "dewar" } },
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
      <ShipmentLayout params={defaultParams}>
        <></>
      </ShipmentLayout>,
    );

    fireEvent.click(screen.getByLabelText("Grid Boxes Step"));

    const stepHeading = screen.getAllByRole("heading", {
      name: /grid boxes/i,
    });

    expect(stepHeading[0]).toHaveAttribute("data-status", "active");
  });

  it("should match current step to current path", () => {
    renderWithProviders(
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: [],
            activeItem: { ...initialState.activeItem, data: { type: "dewar" } },
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
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: [{ id: "dewar-1", label: "dewar-1", data: { type: "dewar" } }],
          },
        },
      },
    );

    const stepHeading = screen.getAllByRole("heading", {
      name: /dewars/i,
    });

    expect(stepHeading[0]).toHaveAttribute("data-status", "incomplete");

    fireEvent.click(
      screen.getByRole("button", {
        name: /view/i,
      }),
    );

    expect(stepHeading[0]).toHaveAttribute("data-status", "active");
  });

  it("should remove item from overview if remove clicked", async () => {
    renderWithProviders(
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: [{ id: "dewar-1", label: "dewar-1", data: { type: "dewar" } }],
          },
        },
      },
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
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: [{ id: "dewar-1", label: "dewar-1", data: { type: "dewar" } }],
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
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: defaultShipmentItems,
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

  it("should move to next step if continue clicked", () => {
    const { store } = renderWithProviders(
      <ShipmentLayout params={{ ...defaultParams }}>
        <></>
      </ShipmentLayout>,
      {
        preloadedState: {
          shipment: {
            ...initialState,
            items: defaultShipmentItems,
          },
        },
      },
    );

    const editButton = screen.getByRole("button", {
      name: /continue/i,
    });

    fireEvent.click(editButton);

    expect(store.getState().shipment.currentStep).toBe(1);
  });
});
