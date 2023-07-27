import { initialState } from "@/features/shipment/shipmentSlice";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import ShipmentLayout from "./layout";

const defaultParams = { proposalId: "cm0001", shipmentId: "new" };

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
        name: /edit/i,
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
});
