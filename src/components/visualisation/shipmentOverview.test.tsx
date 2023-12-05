import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { gridBox, puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

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

describe("Shipment Overview", () => {
  it("should render tree", () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' onActiveChanged={() => {}} proposal='' />,
      {
        preloadedState: { shipment: { ...testInitialState, items: defaultShipment } },
      },
    );

    const dewarAccordion = screen.getByText("dewar");
    expect(dewarAccordion).toBeInTheDocument();

    fireEvent.click(dewarAccordion);

    expect(screen.getByText("puck")).toBeInTheDocument();
  });

  it("should move non-root item to unassigned when remove is clicked", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () =>
          HttpResponse.json({
            containers: [defaultShipment[0].children[0]],
          }),
        { once: true },
      ),
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () =>
          HttpResponse.json({
            children: [{ ...defaultShipment[0], children: [] }],
          }),
        { once: true },
      ),
    );

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: { shipment: { ...testInitialState, items: defaultShipment } },
      },
    );

    fireEvent.click(screen.getByText("dewar"));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    fireEvent.click(screen.getByText(/unassigned/i));
    fireEvent.click(screen.getByText(/containers/i));

    expect(screen.getByText("puck")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText("Remove")).toHaveLength(2));
  });

  it("should remove root item completely when remove is clicked", async () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...testInitialState, items: [{ ...defaultShipment[0], children: [] }] },
        },
      },
    );

    await screen.findByText("dewar");

    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);

    await waitFor(() => expect(screen.queryByText("dewar")).not.toBeInTheDocument());
  });

  it("should update active item if removed item is the active item", async () => {
    const { store } = renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            unassigned: defaultUnassigned,
            activeItem: puck,
            isEdit: true,
          },
        },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    await waitFor(() => expect(store.getState().shipment.isEdit).toBe(false));
  });

  it("should not render body if shipment data is null", async () => {
    const { store } = renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      { preloadedState: { shipment: { ...testInitialState, items: null } } },
    );

    expect(screen.queryByText(/unassigned/i)).not.toBeInTheDocument();
  });

  it("should unassign item if assigned to unassigned item", async () => {
    let unassignedWithAssignedItem = structuredClone(defaultUnassigned);

    unassignedWithAssignedItem[0].children![2].children![0].children = [
      { data: { type: "gridBox", parentId: 6 }, id: 1, name: "Grid Box" },
    ];

    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () =>
          HttpResponse.json({
            samples: [],
            containers: [puck],
            gridBoxes: [gridBox],
          }),
        { once: true },
      ),
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...testInitialState, unassigned: unassignedWithAssignedItem },
        },
      },
    );

    await screen.findByText("Grid Box");

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    //const request = await unassignItemRequest;

    //expect(await request.json()).toMatchObject({ parentId: null });
    await waitFor(() => expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2));
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

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...testInitialState, unassigned: defaultUnassigned },
        },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    await waitFor(() => expect(screen.queryByText(/remove/i)).not.toBeInTheDocument());
  });
});
