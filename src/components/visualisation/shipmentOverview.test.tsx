import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";

const defaultShipment = [
  {
    id: "dewar",
    label: "dewar",
    data: { type: "dewar" },
    children: [{ id: "container", label: "container", data: { type: "puck" } }],
  },
] satisfies TreeData<BaseShipmentItem>[];

describe("Shipment Overview", () => {
  it("should render tree", () => {
    renderWithProviders(<ShipmentOverview onActiveChanged={() => {}} proposal='' />, {
      preloadedState: { shipment: { ...initialState, items: defaultShipment } },
    });

    const dewarAccordion = screen.getByText("dewar");
    expect(dewarAccordion).toBeInTheDocument();

    fireEvent.click(dewarAccordion);

    expect(screen.getByText("container")).toBeInTheDocument();
  });

  it("should move non-root item to unassigned when remove is clicked", () => {
    renderWithProviders(<ShipmentOverview proposal='' onActiveChanged={() => {}} />, {
      preloadedState: { shipment: { ...initialState, items: defaultShipment } },
    });

    fireEvent.click(screen.getByText("dewar"));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    fireEvent.click(screen.getByText(/unassigned/i));
    fireEvent.click(screen.getByText(/containers/i));

    expect(screen.getByText("container")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(2);
  });

  it("should remove root item completely when remove is clicked", async () => {
    renderWithProviders(<ShipmentOverview proposal='' onActiveChanged={() => {}} />, {
      preloadedState: { shipment: { ...initialState, items: defaultShipment } },
    });

    fireEvent.click(screen.getByText("dewar"));

    // Remove container
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    // Remove dewar
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    expect(screen.queryByText("dewar")).not.toBeInTheDocument();
  });
});
