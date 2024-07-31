import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { getCurrentStepIndex } from "@/mappings/pages";
import { renderWithProviders, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { SampleSelector } from "@/components/containers/SampleSelector";

const defaultUnassigned = structuredClone(initialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("sample")].children!.push(sample);

const selectedSample = {
  ...sample,
  data: { type: "sample", location: 1 },
} as TreeData<PositionedItem>;

describe("Child Selector", () => {
  it("should render all samples that belong to selected sessions", () => {});

  it("should render message if selected session has no samples available", () => {});

  it("should render selected item if passed", () => {
    renderWithProviders(
      <SampleSelector
        selectedItem={{ ...sample, data: { type: "sample", location: 1 } }}
        isOpen={true}
        onClose={() => {}}
      />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
    );
  });

  it("should fire event if item is selected", async () => {
    const itemClickCallback = vi.fn();

    renderWithProviders(
      <SampleSelector isOpen={true} onClose={() => {}} onSelect={itemClickCallback} />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
    );
  });

  it("should fire event if item is removed", async () => {
    const itemRemoveCallback = vi.fn();

    renderWithProviders(
      <SampleSelector
        selectedItem={selectedSample}
        isOpen={true}
        onClose={() => {}}
        onRemove={itemRemoveCallback}
      />,
    );

    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(itemRemoveCallback).toHaveBeenCalledWith(selectedSample));
  });

  it("should display toast if invalid proposal reference is provided", () => {});
});
