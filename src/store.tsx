import { configureStore } from "@reduxjs/toolkit";
import shipmentSlice from "./features/shipment/shipmentSlice";

export const store = configureStore({
  reducer: {
    shipment: shipmentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
