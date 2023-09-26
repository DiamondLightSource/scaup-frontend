import { TreeData } from "@/components/visualisation/treeView";
import reducer, {
  addUnassigned,
  initialState,
  removeUnassigned,
  saveActiveItem,
  setActiveItem,
  setShipment,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { UnassignedItemResponse } from "@/types/server";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";
import { rest } from "msw";
import { mockSession, toastMock } from "../../../jest.setup";

const sample: TreeData<BaseShipmentItem> = { id: "1", name: "Sample 01", data: { type: "sample" } };
const puck: TreeData<BaseShipmentItem> = { id: "puck", name: "puck", data: { type: "puck" } };
const getUnassignedByType = (state: typeof initialState, type: string) =>
  state.unassigned[0].children!.find((item) => item.id === type)!.children;

describe("Shipment Unassigned Items Reducers", () => {
  it("should add new unassigned items", () => {
    const newUnassigned: TreeData<BaseShipmentItem> = {
      id: "Foo",
      name: "Bar",
      data: { type: "sample" },
    };
    const newState = reducer(undefined, addUnassigned(newUnassigned));
    expect(
      newState.unassigned[0].children!.find((item) => item.id === "sample")!.children,
    ).toContain(newUnassigned);
  });

  it("should remove items from unassigned", () => {
    const previousUnassigned = structuredClone(initialState).unassigned;
    const unassignedPuckIndex = getCurrentStepIndex("puck");
    previousUnassigned[0].children![unassignedPuckIndex].children = [puck];

    const previousState = {
      ...initialState,
      unassigned: previousUnassigned,
    };

    const newState = reducer(previousState, removeUnassigned(puck));
    expect(newState.unassigned[0].children![unassignedPuckIndex].children).not.toContain(puck);
  });
});

describe("Shipment Items Reducers", () => {
  it("should update shipment items with new shipment items", () => {
    const newShipment: TreeData<BaseShipmentItem>[] = [
      { id: "Foo", name: "Bar", data: { type: "sample" } },
    ];
    expect(reducer(undefined, setShipment(newShipment))).toMatchObject({ items: newShipment });
  });

  it("should update active item and editing status", () => {
    const newActiveItem: TreeData<BaseShipmentItem> = {
      id: "Foo",
      name: "Bar",
      data: { type: "sample" },
    };
    expect(reducer(undefined, setActiveItem({ item: newActiveItem, isEdit: true }))).toMatchObject({
      activeItem: newActiveItem,
      isEdit: true,
    });
  });

  it("should save nested item", () => {
    const previousState = {
      ...initialState,
      items: [
        {
          id: "dewar",
          name: "dewar",
          data: { type: "dewar" },
          children: [puck],
        },
      ] as TreeData<BaseShipmentItem>[],
    };
    const newPuck: TreeData<BaseShipmentItem> = {
      id: "puck",
      name: "puck",
      data: { type: "puck", newValue: "newValue" },
    };
    expect(reducer(previousState, saveActiveItem(newPuck)).items![0].children![0]).toMatchObject({
      data: { type: "puck", newValue: "newValue" },
    });
  });
});

describe("Shipment Async Thunks", () => {
  it("should display toast if shipment response is not valid", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(404), ctx.json({})),
      ),
    );

    const { store } = renderWithProviders(<></>);
    store.dispatch(updateShipment({ session: mockSession, shipmentId: "1" }));

    await waitFor(() => expect(toastMock).toBeCalled());
  });

  it("should display toast if unassigned item response is not valid", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(ctx.status(404), ctx.json({})),
      ),
    );

    const { store } = renderWithProviders(<></>);
    store.dispatch(updateUnassigned({ session: mockSession, shipmentId: "1" }));

    await waitFor(() => expect(toastMock).toBeCalled());
  });

  it("should update store with new shipment when thunk called", async () => {
    const { store } = renderWithProviders(<></>);
    store.dispatch(updateShipment({ session: mockSession, shipmentId: "1" }));

    await waitFor(() =>
      expect(store.getState().shipment.items).toMatchObject(defaultData.children),
    );
  });

  it("should update store with new unassigned items when thunk called", async () => {
    const unassignedResponse = {
      samples: [sample],
      containers: [puck],
      gridBoxes: [],
    } satisfies UnassignedItemResponse;

    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json(unassignedResponse)),
      ),
    );

    const { store } = renderWithProviders(<></>);
    store.dispatch(updateUnassigned({ session: mockSession, shipmentId: "1" }));

    await waitFor(() =>
      expect(getUnassignedByType(store.getState().shipment, "container")).toMatchObject([puck]),
    );

    expect(getUnassignedByType(store.getState().shipment, "sample")).toMatchObject([sample]);
  });
});
