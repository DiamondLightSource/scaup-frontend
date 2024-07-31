import { TreeData } from "@/components/visualisation/treeView";
import { setInUnassignedClone } from "@/features/shipment/utils";
import { BaseShipmentItem, pluralToSingular } from "@/mappings/pages";
import { RootState } from "@/store";
import { RootParentType } from "@/types/generic";
import { UnassignedItemResponse } from "@/types/server";
import { authenticatedFetch } from "@/utils/client";
import { parentTypeToEndpoint } from "@/utils/client/shipment";
import { recursiveFind, setTagInPlace } from "@/utils/tree";
import { createStandaloneToast } from "@chakra-ui/react";
import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

const { toast } = createStandaloneToast();

export interface ShipmentThunkParams {
  shipmentId: string;
  parentType?: RootParentType;
}

export const updateShipment = createAsyncThunk(
  "shipment/updateShipment",
  async ({ shipmentId, parentType = "shipment" }: ShipmentThunkParams, thunkAPI) => {
    const parentEndpoint = parentTypeToEndpoint[parentType];
    const response = await authenticatedFetch.client(`/${parentEndpoint}/${shipmentId}`);
    if (response && response.status === 200) {
      const shipment = await response.json();
      return parentType === "shipment" ? shipment.children : [shipment];
    } else {
      toast({ title: "An error ocurred", description: "Unable to retrieve shipment data" });
      thunkAPI.rejectWithValue(null);
    }
  },
);

export const updateUnassigned = createAsyncThunk(
  "shipment/updateUnassigned",
  async ({ shipmentId, parentType = "shipment" }: ShipmentThunkParams, thunkAPI) => {
    const parentEndpoint = parentTypeToEndpoint[parentType];
    const endpointPrefix = `/${parentEndpoint}${parentType === "shipment" ? `/${shipmentId}` : ""}`;
    const response = await authenticatedFetch.client(`${endpointPrefix}/unassigned`);
    if (response) {
      if (response.status === 200) {
        const unassigned = await response.json();
        if (parentType === "topLevelContainer") {
          return { gridBoxes: [], samples: [], containers: unassigned.items };
        }
        return unassigned;
      } else if (response.status === 404) {
        return { gridBoxes: [], samples: [], containers: [] };
      }
    }
    toast({ title: "An error ocurred", description: "Unable to retrieve unassigned item data" });
    thunkAPI.rejectWithValue(null);
  },
);

export interface ShipmentState {
  /** Shipment items (assigned) */
  items: TreeData<BaseShipmentItem>[] | null;
  /** Active item (item being edited, for example) */
  activeItem: TreeData<BaseShipmentItem> | null;
  /** Unassigned items */
  unassigned: TreeData[];
  /** Whether or not active item is an existing item being edited or a new item */
  isEdit: boolean;
  /** Current item is being reviewed */
  isReview: boolean;
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

export const initialState: ShipmentState = {
  items: null,
  activeItem: null,
  unassigned: defaultUnassigned,
  isEdit: false,
  isReview: false,
};

export const shipmentSlice = createSlice({
  name: "shipment",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(updateShipment.fulfilled, (state, action: PayloadAction<TreeData[]>) => {
      if (action.payload) {
        const newItems = structuredClone(action.payload);
        setTagInPlace(newItems);
        state.items = newItems;
      }
    });
    builder.addCase(
      updateUnassigned.fulfilled,
      (state, action: PayloadAction<UnassignedItemResponse>) => {
        if (action.payload) {
          let newUnassigned = structuredClone(current(state.unassigned));

          for (const [key, value] of Object.entries(action.payload)) {
            setInUnassignedClone(newUnassigned, value, pluralToSingular[key]);
          }

          setTagInPlace(newUnassigned);
          state.unassigned = newUnassigned;
        }
      },
    );
    builder.addCase(updateShipment.rejected, () => {});
  },
  reducers: {
    setShipment: (state, action: PayloadAction<ShipmentState["items"]>) => {
      const newItems = structuredClone(action.payload)!;
      setTagInPlace(newItems);
      state.items = newItems;
    },
    /** Set array of undefined items */
    setUnassigned: (state, action: PayloadAction<{ items: TreeData[]; type: string }>) => {
      state.unassigned = setInUnassignedClone(
        structuredClone(current(state.unassigned)),
        action.payload.items,
        action.payload.type,
      );
    },
    setNewActiveItem: (
      state,
      action: PayloadAction<{ type: BaseShipmentItem["type"]; title: string }>,
    ) => {
      state.activeItem = {
        id: `new-${action.payload.type}`,
        name: `New ${action.payload.title}`,
        data: {
          type: action.payload.type,
        },
      };

      state.isEdit = false;
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
    /** Sync active item to its representation inside the shipment items state.
     *
     * @param id ID to search for when substituting current active item. If no id is
     * passed, the ID of the current active item is used
     */
    syncActiveItem: (
      state,
      action: PayloadAction<
        { id?: number | string | undefined; type?: BaseShipmentItem["type"] } | undefined
      >,
    ) => {
      let actualId = state.activeItem ? state.activeItem.id : 0;
      let actualType = state.activeItem ? state.activeItem.data.type : "sample";
      let activeItemExists = false;
      let haystack = [...current(state.unassigned)];

      if (action.payload) {
        if (action.payload.id) {
          actualId = action.payload.id;
        }

        if (action.payload.type) {
          actualType = action.payload.type;
        }
      }

      if (state.items !== null) {
        // Merge unassigned and assigned items, since our item could be in both
        haystack = haystack.concat(current(state.items));
      }

      recursiveFind(haystack, actualId, actualType, (item) => {
        state.activeItem = item;
        activeItemExists = true;
      });

      state.isEdit = activeItemExists;

      if (!activeItemExists) {
        state.activeItem = {
          id: `new-${actualType}`,
          name: `New ${actualType}`,
          data: {
            type: actualType,
          },
        };
      }
    },
    setIsReview: (state, action: PayloadAction<boolean>) => {
      state.isReview = action.payload;
    },
  },
});

export const {
  setShipment,
  setUnassigned,
  setActiveItem,
  syncActiveItem,
  setIsReview,
  setNewActiveItem,
} = shipmentSlice.actions;
export const selectItems = (state: RootState) => state.shipment.items;
export const selectActiveItem = (state: RootState) => state.shipment.activeItem;
export const selectUnassigned = (state: RootState) => state.shipment.unassigned;
export const selectIsEdit = (state: RootState) => state.shipment.isEdit;
export const selectIsReview = (state: RootState) => state.shipment.isReview;

export default shipmentSlice.reducer;
