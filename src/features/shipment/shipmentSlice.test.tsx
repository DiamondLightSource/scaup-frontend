import { TreeData } from "@/components/visualisation/treeView";
import reducer, {
  initialState,
  setActiveItem,
  setNewActiveItem,
  setShipment,
  syncActiveItem
} from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { defaultData } from "@/mocks/handlers";
import { puck, testInitialState } from "@/utils/test-utils";

const sample: TreeData<BaseShipmentItem> = { id: "1", name: "Sample 01", data: { type: "sample" } };
const getUnassignedByType = (state: typeof initialState, type: string) =>
  state.unassigned[0].children!.find((item) => item.id === type)!.children;

describe("Shipment Unassigned Items Reducers", () => {
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
      expect(
        reducer(undefined, setActiveItem({ item: newActiveItem, isEdit: true })),
      ).toMatchObject({
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

    describe("Active Item Sync", () => {
      it("should sync active item if in assigned items", () => {
        const previousState = {
          ...testInitialState,
          items: [
            {
              id: "dewar",
              name: "new-dewar",
              data: { type: "dewar" },
            },
          ] as TreeData<BaseShipmentItem>[],
          activeItem: { id: "dewar", name: "old-dewar", data: { type: "dewar" } },
        } as typeof testInitialState;

        expect(reducer(previousState, syncActiveItem())).toMatchObject({
          activeItem: { id: "dewar", name: "new-dewar", data: { type: "dewar" } },
          isEdit: true,
        });
      });

      it("should sync active item if in unassigned items", () => {
        const previousUnassigned = structuredClone(testInitialState).unassigned;
        const unassignedPuckIndex = getCurrentStepIndex("puck");
        previousUnassigned[0].children![unassignedPuckIndex].children = [puck];

        const previousState = {
          ...testInitialState,
          unassigned: previousUnassigned,
          activeItem: { id: 9, name: "old-puck", data: { type: "puck" } },
          isEdit: true,
        } as typeof testInitialState;

        expect(reducer(previousState, syncActiveItem())).toMatchObject({
          activeItem: { id: 9, name: "puck", data: { type: "puck" } },
          isEdit: true,
        });
      });

      it("should use passed ID and type when syncing active item", () => {
        const previousState = {
          ...testInitialState,
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
          ...testInitialState,
          activeItem: oldItem,
          isEdit: true,
        } as typeof initialState;

        expect(reducer(previousState, syncActiveItem())).toMatchObject({
          isEdit: false,
        });
      });

      it("should set edit status to false if item being searched for does not exist", async () => {
        const previousState = {
          ...testInitialState,
          isEdit: true,
        } as typeof initialState;

        expect(
          reducer(previousState, syncActiveItem({ id: "doesnotexist", type: "puck" })),
        ).toMatchObject({
          isEdit: false,
        });
      });

      it("should use blank item if existence check fails and current active item is null", async () => {
        const previousState = {
          ...testInitialState,
          activeItem: null,
        } as typeof initialState;

        expect(
          reducer(previousState, syncActiveItem({ id: "doesnotexist", type: "puck" })),
        ).toMatchObject({
          isEdit: false,
          activeItem: {
            data: { type: "puck" },
            id: "new-puck",
            name: "New puck",
          },
        });
      });

      it("should use blank item if current shipment is null", async () => {
        const previousState = {
          ...testInitialState,
          items: null,
        } as typeof initialState;

        expect(
          reducer(previousState, syncActiveItem({ id: "doesnotexist", type: "puck" })),
        ).toMatchObject({
          isEdit: false,
          activeItem: {
            data: { type: "puck" },
            id: "new-puck",
            name: "New puck",
          },
        });
      });
    });
  });
});
