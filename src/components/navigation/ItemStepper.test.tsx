import { TreeData } from "@/components/visualisation/treeView";
import { internalEbicSteps, steps } from "@/mappings/pages";
import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { ItemStepper } from "./ItemStepper";

const defaultShipmentItems: TreeData[] = [
  {
    id: "",
    name: "",
    data: { type: "dewar" },
    children: [puck],
  },
];

describe("Item Stepper", () => {
  it("should render steps", () => {
    renderWithProviders(<ItemStepper steps={steps} onStepChanged={() => {}} currentStep={0} />);

    expect(screen.getByLabelText("Grids Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Grid Boxes Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Containers Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Packages Step")).toBeInTheDocument();
  });

  it("should count item amounts", () => {
    renderWithProviders(<ItemStepper steps={steps} onStepChanged={() => {}} currentStep={0} />, {
      preloadedState: { shipment: { ...testInitialState, items: defaultShipmentItems } },
    });

    expect(screen.getByText(/1 Packages/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Containers/i)).toBeInTheDocument();
  });

  it("should call callback if item counts change", () => {
    const typeCountCallback = vi.fn();
    renderWithProviders(
      <ItemStepper
        steps={steps}
        onStepChanged={() => {}}
        currentStep={0}
        onTypeCountChanged={typeCountCallback}
      />,
      { preloadedState: { shipment: { ...testInitialState, items: defaultShipmentItems } } },
    );

    expect(typeCountCallback).toBeCalledWith([
      { total: 0, unassigned: 0 },
      { total: 0, unassigned: 0 },
      { total: 1, unassigned: 0 },
      { total: 1, unassigned: 0 },
    ]);
  });

  it("should call callback if step clicked", () => {
    const stepClickedCallback = vi.fn();
    renderWithProviders(
      <ItemStepper steps={steps} onStepChanged={stepClickedCallback} currentStep={0} />,
    );

    const stepHeading = screen.getByRole("heading", {
      name: /packages/i,
    });

    fireEvent.click(stepHeading);

    expect(stepClickedCallback).toBeCalledWith(3);
  });
});
