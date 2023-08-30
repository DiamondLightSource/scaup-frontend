import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";

const defaultShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [{ id: "container", name: "container", data: { type: "puck" } }],
  },
] satisfies TreeData<BaseShipmentItem>[];

describe("Shipment Overview", () => {
  it("should render tree", () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' onActiveChanged={() => {}} proposal='' />,
      {
        preloadedState: { shipment: { ...initialState, items: defaultShipment } },
      },
    );

    const dewarAccordion = screen.getByText("dewar");
    expect(dewarAccordion).toBeInTheDocument();

    fireEvent.click(dewarAccordion);

    expect(screen.getByText("container")).toBeInTheDocument();
  });

  it("should move non-root item to unassigned when remove is clicked", () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: { shipment: { ...initialState, items: defaultShipment } },
      },
    );

    fireEvent.click(screen.getByText("dewar"));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    fireEvent.click(screen.getByText(/unassigned/i));
    fireEvent.click(screen.getByText(/containers/i));

    expect(screen.getByText("container")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(2);
  });

  it("should remove root item completely when remove is clicked", async () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: { shipment: { ...initialState, items: defaultShipment } },
      },
    );

    await screen.findByText("dewar");

    // Remove container
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    // Remove dewar
    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);

    await waitFor(() => expect(screen.queryByText("dewar")).not.toBeInTheDocument());
  });

  it("should remove item from unassigned when clicked", async () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: { shipment: { ...initialState, items: defaultShipment } },
      },
    );

    // TODO
  });
});
