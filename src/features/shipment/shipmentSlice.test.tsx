import { TreeData } from "@/components/visualisation/treeView";
import reducer, {
  addUnassigned,
  initialState,
  removeUnassigned,
  saveActiveItem,
  setActiveItem,
  setNewActiveItem,
  setShipment,
  syncActiveItem,
  updateShipment,
  updateUnassigned,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { UnassignedItemResponse } from "@/types/server";
import { puck, renderWithProviders } from "@/utils/test-utils";
import { waitFor } from "@testing-library/react";
import { rest } from "msw";
import { mockSession, toastMock } from "../../../jest.setup";

const sample: TreeData<BaseShipmentItem> = { id: "1", name: "Sample 01", data: { type: "sample" } };
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

  it("should set active item to default new item values", () => {
    expect(reducer(undefined, setNewActiveItem({ type: "puck", title: "Puck" }))).toMatchObject({
      activeItem: {
        name: "New Puck",
        id: "new-puck",
        data: { type: "puck" },
      },
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
      id: 9,
      name: "puck",
      data: { type: "puck", newValue: "newValue" },
    };
    expect(reducer(previousState, saveActiveItem(newPuck)).items![0].children![0]).toMatchObject({
      data: { type: "puck", newValue: "newValue" },
    });
  });
});

describe("Active Item Sync", () => {
  it("should sync active item if in assigned items", () => {
    const previousState = {
      ...initialState,
      items: [
        {
          id: "dewar",
          name: "new-dewar",
          data: { type: "dewar" },
        },
      ] as TreeData<BaseShipmentItem>[],
      activeItem: { id: "dewar", name: "old-dewar", data: { type: "dewar" } },
    } as typeof initialState;

    expect(reducer(previousState, syncActiveItem())).toMatchObject({
      activeItem: { id: "dewar", name: "new-dewar", data: { type: "dewar" } },
      isEdit: true,
    });
  });

  it("should sync active item if in unassigned items", () => {
    const previousUnassigned = structuredClone(initialState).unassigned;
    const unassignedPuckIndex = getCurrentStepIndex("puck");
    previousUnassigned[0].children![unassignedPuckIndex].children = [puck];

    const previousState = {
      ...initialState,
      unassigned: previousUnassigned,
      activeItem: { id: 9, name: "old-puck", data: { type: "puck" } },
      isEdit: true,
    } as typeof initialState;

    expect(reducer(previousState, syncActiveItem())).toMatchObject({
      activeItem: { id: 9, name: "puck", data: { type: "puck" } },
      isEdit: true,
    });
  });

  it("should use passed ID and type when syncing active item", () => {
    const previousState = {
      ...initialState,
      items: defaultData.children,
    } as typeof initialState;

    expect(reducer(previousState, syncActiveItem({ id: 1, type: "dewar" }))).toMatchObject({
      activeItem: { id: 1, name: "Dewar", data: { type: "dewar" } },
      isEdit: true,
    });
  });

  it("should set edit status to false if current item no longer exists", async () => {
    const oldItem = { id: "doesnotexist", name: "doesnotexist", data: { type: "puck" } };
    const previousState = {
      ...initialState,
      activeItem: oldItem,
      isEdit: true,
    } as typeof initialState;

    expect(reducer(previousState, syncActiveItem())).toMatchObject({
      activeItem: oldItem,
      isEdit: false,
    });
  });

  it("should set edit status to false if item being searched for does not exist", async () => {
    const previousState = {
      ...initialState,
      isEdit: true,
    } as typeof initialState;

    expect(
      reducer(previousState, syncActiveItem({ id: "doesnotexist", type: "puck" })),
    ).toMatchObject({
      isEdit: false,
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

    await waitFor(() =>
      expect(toastMock).toBeCalledWith({
        title: "An error ocurred",
        description: "Unable to retrieve unassigned item data",
      }),
    );
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
