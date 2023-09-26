import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex, pluralToSingular } from "@/mappings/pages";
import { RootState } from "@/store";
import { UnassignedItemResponse } from "@/types/server";
import { authenticatedFetch } from "@/utils/client";
import { recursiveFind } from "@/utils/tree";
import { createStandaloneToast } from "@chakra-ui/react";
import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { Session } from "next-auth";
import { setInUnassignedClone } from "./utils";

const { toast } = createStandaloneToast();

interface ShipmentThunkParams {
  session: Session | null;
  shipmentId: string;
}

export const updateShipment = createAsyncThunk(
  "shipment/updateShipment",
  async ({ session, shipmentId }: ShipmentThunkParams, thunkAPI) => {
    const response = await authenticatedFetch.client(`/shipments/${shipmentId}`, session);
    if (response && response.status === 200) {
      return (await response.json()).children;
    } else {
      toast({ title: "An error ocurred", description: "Unable to retrieve shipment data" });
      thunkAPI.rejectWithValue(null);
    }
  },
);

export const updateUnassigned = createAsyncThunk(
  "shipment/updateUnassigned",
  async ({ session, shipmentId }: ShipmentThunkParams, thunkAPI) => {
    const response = await authenticatedFetch.client(
      `/shipments/${shipmentId}/unassigned`,
      session,
    );
    if (response && response.status === 200) {
      return await response.json();
    } else {
      thunkAPI.rejectWithValue(null);
    }
  },
);

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

export const defaultUnassigned = [
  {
    name: "Unassigned",
    isNotViewable: true,
    id: "root",
    data: {},
    children: [
      {
        name: "Samples",
        id: "sample",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
      {
        name: "Grid Boxes",
        id: "gridBox",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
      {
        name: "Containers",
        id: "container",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
    ],
  },
] satisfies TreeData[];

const defaultActive = {
  name: "New Sample",
  id: "new-sample",
  data: { type: "sample" },
} as TreeData<BaseShipmentItem>;

export const initialState: ShipmentState = {
  items: undefined,
  activeItem: defaultActive,
  unassigned: defaultUnassigned,
  isEdit: false,
  currentStep: 0,
};

// https://github.com/reduxjs/redux/issues/368
const addToUnassignedClone = (unassigned: TreeData[], item: TreeData<BaseShipmentItem>) => {
  const newUnassigned = structuredClone(unassigned);
  newUnassigned[0].children![getCurrentStepIndex(item.data.type)].children!.push(item);
  return newUnassigned;
};

export const shipmentSlice = createSlice({
  name: "shipment",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(updateShipment.fulfilled, (state, action: PayloadAction<TreeData[]>) => {
      state.items = action.payload;
    });
    builder.addCase(
      updateUnassigned.fulfilled,
      (state, action: PayloadAction<UnassignedItemResponse>) => {
        if (action.payload) {
          let newUnassigned = structuredClone(current(state.unassigned));

          for (const [key, value] of Object.entries(action.payload)) {
            setInUnassignedClone(newUnassigned, value, pluralToSingular[key]);
          }

          state.unassigned = newUnassigned;
        }
      },
    );
    builder.addCase(updateShipment.rejected, () => {});
  },
  reducers: {
    setShipment: (state, action: PayloadAction<ShipmentState["items"]>) => {
      state.items = action.payload;
    },
    /** Set array of undefined items */
    setUnassigned: (state, action: PayloadAction<{ items: TreeData[]; type: string }>) => {
      state.unassigned = setInUnassignedClone(
        structuredClone(current(state.unassigned)),
        action.payload.items,
        action.payload.type,
      );
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
        recursiveFind(
          newItems,
          action.payload.id,
          action.payload.data.type,
          (_, i, arr) => (arr[i] = action.payload),
        );
        state.items = newItems;
      }
    },
    /** Add single unassigned item */
    addUnassigned: (state, action: PayloadAction<TreeData<BaseShipmentItem>>) => {
      state.unassigned = addToUnassignedClone(current(state.unassigned), action.payload);
    },
    /** Remove item from list of unassigned items */
    removeUnassigned: (state, action: PayloadAction<TreeData<BaseShipmentItem>>) => {
      const newUnassigned = structuredClone(current(state.unassigned));

      recursiveFind(newUnassigned, action.payload.id, action.payload.data.type, (_, i, arr) => {
        arr.splice(i, 1);
      });

      state.unassigned = newUnassigned;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
  },
});

export const {
  setShipment,
  setUnassigned,
  setActiveItem,
  saveActiveItem,
  addUnassigned,
  removeUnassigned,
  setStep,
} = shipmentSlice.actions;
export const selectItems = (state: RootState) => state.shipment.items;
export const selectActiveItem = (state: RootState) => state.shipment.activeItem;
export const selectUnassigned = (state: RootState) => state.shipment.unassigned;
export const selectIsEdit = (state: RootState) => state.shipment.isEdit;
export const selectStep = (state: RootState) => state.shipment.currentStep;

export default shipmentSlice.reducer;
