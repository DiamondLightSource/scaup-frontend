import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { getCurrentStepIndex } from "@/mappings/pages";
import { renderWithProviders, sample } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { ChildSelector } from "./childSelector";

const defaultUnassigned = structuredClone(initialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("sample")].children!.push(sample);

const selectedSample = {
  ...sample,
  data: { type: "sample", location: 1 },
} as TreeData<PositionedItem>;

describe("Child Selector", () => {
  it("should render all unassigned items that belong to passed type", () => {
    renderWithProviders(<ChildSelector childrenType='sample' isOpen={true} onClose={() => {}} />, {
      preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
    });

    expect(screen.getByText("Sample")).toBeInTheDocument();
  });

  it("should render selected item if passed", () => {
    renderWithProviders(
      <ChildSelector
        selectedItem={{ ...sample, data: { type: "sample", location: 1 } }}
        childrenType='sample'
        isOpen={true}
        onClose={() => {}}
      />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
    );

    expect(screen.getAllByText("Sample")).toHaveLength(2);
  });

  it("should render message if no unassigned items are available", () => {
    renderWithProviders(
      <ChildSelector
        selectedItem={selectedSample}
        childrenType='sample'
        isOpen={true}
        onClose={() => {}}
      />,
    );

    screen.getByText(/no unassigned samples/i);
  });

  it("should fire event if item is selected", async () => {
    const itemClickCallback = jest.fn();

    renderWithProviders(
      <ChildSelector
        childrenType='sample'
        isOpen={true}
        onClose={() => {}}
        onSelect={itemClickCallback}
      />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
    );

    fireEvent.click(screen.getByText("Sample"));

    await waitFor(() => expect(itemClickCallback).toBeCalledWith(sample));
  });

  it("should fire event if item is removed", async () => {
    const itemRemoveCallback = jest.fn();

    renderWithProviders(
      <ChildSelector
        selectedItem={selectedSample}
        childrenType='sample'
        isOpen={true}
        onClose={() => {}}
        onRemove={itemRemoveCallback}
      />,
    );

    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(itemRemoveCallback).toBeCalledWith(selectedSample));
  });
});
