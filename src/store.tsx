import proposalSlice from "@/features/shipment/proposalSlice";
import shipmentSlice from "@/features/shipment/shipmentSlice";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/shipment/authSlice";

export const store = configureStore({
  reducer: {
    shipment: shipmentSlice,
    proposal: proposalSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
