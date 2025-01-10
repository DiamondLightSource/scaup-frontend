import { ShipmentOverview } from "@/components/visualisation/ShipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { toastMock } from "@/../vitest.setup";

const defaultShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [puck],
  },
] satisfies TreeData<BaseShipmentItem>[];

const defaultUnassigned = structuredClone(testInitialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("puck")].children!.push(puck);

describe("Sample Collection Overview", () => {
  it("should render tree", () => {
    renderWithProviders(<ShipmentOverview onActiveChanged={() => {}} title='' />, {
      preloadedState: { shipment: { ...testInitialState, items: defaultShipment } },
    });

    const dewarAccordion = screen.getByText("dewar");
    expect(dewarAccordion).toBeInTheDocument();

    fireEvent.click(dewarAccordion);

    expect(screen.getByText("puck")).toBeInTheDocument();
  });

  it("should move non-root item to unassigned when remove is clicked", async () => {
    renderWithProviders(<ShipmentOverview title='' onActiveChanged={() => {}} />, {
      preloadedState: { shipment: { ...testInitialState, items: defaultShipment } },
    });

    fireEvent.click(screen.getByText("dewar"));
    fireEvent.click(screen.getByText("Remove"));
    await waitFor(() =>
      expect(toastMock).toBeCalledWith({ title: "Successfully unassigned item!" }),
    );
  });

  it("should remove root item completely when remove is clicked", async () => {
    renderWithProviders(<ShipmentOverview title='' onActiveChanged={() => {}} />, {
      preloadedState: {
        shipment: { ...testInitialState, items: [{ ...defaultShipment[0], children: [] }] },
      },
    });

    screen.getByText("dewar");

    fireEvent.click(screen.getAllByText("Remove")[0]);
    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({ title: "Successfully removed item!" }),
    );
  });

  it("should not render body if shipment data is null", () => {
    renderWithProviders(<ShipmentOverview title='' onActiveChanged={() => {}} />, {
      preloadedState: { shipment: { ...testInitialState, items: null } },
    });

    expect(screen.queryByText(/unassigned/i)).not.toBeInTheDocument();
  });

  it("should unassign item if assigned to unassigned item", async () => {
    let unassignedWithAssignedItem = structuredClone(defaultUnassigned);

    unassignedWithAssignedItem[0].children![2].children![0].children = [
      { data: { type: "gridBox", parentId: 6 }, id: 1, name: "Grid Box" },
    ];

    renderWithProviders(<ShipmentOverview title='' onActiveChanged={() => {}} />, {
      preloadedState: {
        shipment: { ...testInitialState, unassigned: unassignedWithAssignedItem },
      },
    });

    fireEvent.click(screen.getByText("Remove"));
    await waitFor(() =>
      expect(toastMock).toBeCalledWith({ title: "Successfully unassigned item!" }),
    );
  });

  it("should remove item from unassigned when clicked", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () =>
          HttpResponse.json({
            containers: [],
          }),
        { once: true },
      ),
    );

    renderWithProviders(<ShipmentOverview title='' onActiveChanged={() => {}} />, {
      preloadedState: {
        shipment: { ...testInitialState, unassigned: defaultUnassigned },
      },
    });

    fireEvent.click(screen.getByText("Remove"));
    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith({ title: "Successfully removed item!" }),
    );
  });
});
