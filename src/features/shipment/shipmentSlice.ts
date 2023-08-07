import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { RootState } from "@/store";
import { recursiveFind } from "@/utils/tree";
import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

export interface ShipmentState {
  /** Shipment items (assigned) */
  items: TreeData<BaseShipmentItem>[] | undefined;
  /** Active item (item being edited, for example) */
  activeItem: TreeData<BaseShipmentItem>;
  /** Unassigned items */
  unassigned: TreeData[];
  /** Whether or not active item is an existing item being edited or a new item */
  isEdit: boolean;
  /** Current step index */
  currentStep: number;
}

const defaultUnassigned = [
  {
    label: "Unassigned",
    isNotViewable: true,
    id: "root",
    data: {},
    children: [
      {
        label: "Samples",
        id: "sample",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
      {
        label: "Grid Boxes",
        id: "gridBox",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
      {
        label: "Containers",
        id: "container",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
    ],
  },
] as TreeData[];

const defaultActive = {
  label: "New Sample",
  id: "new-sample",
  data: { type: "sample" },
} as TreeData<BaseShipmentItem>;

const addToUnassigned = (
  unassigned: typeof defaultUnassigned,
  item: TreeData<BaseShipmentItem>,
) => {
  const newUnassigned = structuredClone(unassigned);
  newUnassigned[0].children![getCurrentStepIndex(item.data.type)].children!.push(item);
  return newUnassigned;
};

export const initialState: ShipmentState = {
  items: undefined,
  activeItem: defaultActive,
  unassigned: defaultUnassigned,
  isEdit: false,
  currentStep: 0,
};

export const shipmentSlice = createSlice({
  name: "shipment",
  initialState,
  reducers: {
    setShipment: (state, action: PayloadAction<ShipmentState["items"]>) => {
      state.items = action.payload;
    },
    /** Set active item without modifying shipment items */
    setActiveItem: (
      state,
      action: PayloadAction<{ item: ShipmentState["activeItem"]; isEdit?: boolean }>,
    ) => {
      state.activeItem = action.payload.item;
      if (action.payload.isEdit !== undefined) {
        state.isEdit = action.payload.isEdit;
      }
    },
    /** Save active item to shipment items list */
    saveActiveItem: (state, action: PayloadAction<ShipmentState["activeItem"]>) => {
      if (state.items) {
        // This is a proxy; we need to unwrap it to access the internal state
        const newItems = structuredClone(current(state.items));
        recursiveFind(newItems, action.payload.id, (_, i, arr) => (arr[i] = action.payload));
        state.items = newItems;
      }
    },
    addUnassigned: (state, action: PayloadAction<TreeData<BaseShipmentItem>>) => {
      state.unassigned = addToUnassigned(current(state.unassigned), action.payload);
    },
    removeUnassigned: (state, action: PayloadAction<TreeData<BaseShipmentItem>>) => {
      const newUnassigned = structuredClone(current(state.unassigned));

      recursiveFind(newUnassigned, action.payload.id, (_, i, arr) => {
        arr.splice(i, 1);
      });

      state.unassigned = newUnassigned;
    },
    moveToUnassigned: (state, action: PayloadAction<TreeData<BaseShipmentItem>>) => {
      if (!state.items) {
        return;
      }

      const innerData = structuredClone(current(state.items));
      const item = structuredClone(action.payload);

      if (item.data.position !== undefined) {
        item.data.position = null;
      }

      recursiveFind(innerData, item.id, (item, i, arr) => {
        // Remove item by modifying passed reference
        arr.splice(i, 1);
        if (state.activeItem.id === item.id) {
          state.activeItem = item;
        } else if (
          state.activeItem.children &&
          state.activeItem.children.find((activeChild) => activeChild.id === item.id) !== undefined
        ) {
          const newActiveItem = structuredClone(current(state.activeItem));
          newActiveItem.children = arr;
          state.activeItem = newActiveItem;
        }
      });

      state.unassigned = addToUnassigned(current(state.unassigned), action.payload);
      state.items = innerData;
    },
    addRootItem: (state, action: PayloadAction<TreeData<BaseShipmentItem>>) => {
      if (state.items) {
        const newItems = structuredClone(current(state.items));
        newItems.push(action.payload);
        state.items = newItems;
      } else {
        state.items = [action.payload];
      }
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
  },
});

export const {
  setShipment,
  setActiveItem,
  saveActiveItem,
  addUnassigned,
  addRootItem,
  moveToUnassigned,
  removeUnassigned,
  setStep,
} = shipmentSlice.actions;
export const selectItems = (state: RootState) => state.shipment.items;
export const selectActiveItem = (state: RootState) => state.shipment.activeItem;
export const selectUnassigned = (state: RootState) => state.shipment.unassigned;
export const selectIsEdit = (state: RootState) => state.shipment.isEdit;
export const selectStep = (state: RootState) => state.shipment.currentStep;

export default shipmentSlice.reducer;
