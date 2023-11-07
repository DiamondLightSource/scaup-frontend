import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { gridBox, puck, renderWithProviders, waitForRequest } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

const defaultShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [puck],
  },
] satisfies TreeData<BaseShipmentItem>[];

const defaultUnassigned = structuredClone(initialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("puck")].children!.push(puck);

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

    expect(screen.getByText("puck")).toBeInTheDocument();
  });

  it("should move non-root item to unassigned when remove is clicked", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            containers: [defaultShipment[0].children[0]],
          }),
        ),
      ),
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            children: [{ ...defaultShipment[0], children: [] }],
          }),
        ),
      ),
    );

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

    expect(screen.getByText("puck")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText("Remove")).toHaveLength(2));
  });

  it("should remove root item completely when remove is clicked", async () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...initialState, items: [{ ...defaultShipment[0], children: [] }] },
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
            ...initialState,
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

  it("should unassign item if assigned to unassigned item", async () => {
    const unassignItemRequest = waitForRequest(
      "PATCH",
      "http://localhost/api/shipments/:shipmentId/:itemType/:itemId",
    );

    let unassignedWithAssignedItem = structuredClone(defaultUnassigned);

    unassignedWithAssignedItem[0].children![2].children![0].children = [
      { data: { type: "gridBox", parentId: 6 }, id: 1, name: "Grid Box" },
    ];

    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            samples: [],
            containers: [puck],
            gridBoxes: [gridBox],
          }),
        ),
      ),
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...initialState, unassigned: unassignedWithAssignedItem },
        },
      },
    );

    await screen.findByText("Grid Box");

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    const request = await unassignItemRequest;

    expect(await request.json()).toMatchObject({ parentId: null });
    await waitFor(() => expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2));
  });

  it("should remove item from unassigned when clicked", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            containers: [],
          }),
        ),
      ),
    );

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...initialState, unassigned: defaultUnassigned },
        },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    await waitFor(() => expect(screen.queryByText(/remove/i)).not.toBeInTheDocument());
  });
});
