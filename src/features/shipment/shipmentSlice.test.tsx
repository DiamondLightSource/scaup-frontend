import { TreeData } from "@/components/visualisation/treeView";
import reducer, {
  addUnassigned,
  initialState,
  moveToUnassigned,
  removeUnassigned,
  saveActiveItem,
  setActiveItem,
  setShipment,
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import "@testing-library/jest-dom";

const defaultParams = { proposalId: "cm0001", shipmentId: "new" };

describe("Shipment Unassigned Items Reducers", () => {
  const puck: TreeData<BaseShipmentItem> = { id: "puck", name: "puck", data: { type: "puck" } };

  const getUnassignedContainers = (state: typeof initialState) =>
    state.unassigned[0].children!.find((item) => item.id === "container")!.children;

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

  it("should move items to unassigned", () => {
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

    const newState = reducer(previousState, moveToUnassigned(puck));
    expect(getUnassignedContainers(newState)).toContain(puck);
    expect(newState.items![0].children).toEqual([]);
  });

  it("should not do anything if move to unassigned is attempted with no items in store", () => {
    const previousState = {
      ...initialState,
      items: [] as TreeData<BaseShipmentItem>[],
    };

    const newState = reducer(previousState, moveToUnassigned(puck));
    expect(getUnassignedContainers(newState)).not.toContain(puck);
  });

  it("should update active item if children are moved to unassigned", () => {
    const activeItem: TreeData<BaseShipmentItem> = {
      id: "dewar",
      name: "dewar",
      data: { type: "dewar" },
      children: [puck],
    };
    const previousState = {
      ...initialState,
      activeItem,
      items: [activeItem] as TreeData<BaseShipmentItem>[],
    };

    const newState = reducer(previousState, moveToUnassigned(puck));
    expect(newState.activeItem).toEqual({ ...activeItem, children: [] });
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
          children: [{ id: "puck", name: "puck", data: { type: "puck" } }],
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
