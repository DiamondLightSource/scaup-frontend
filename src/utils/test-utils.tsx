import { TreeData } from "@/components/treeView";
import shipmentSlice, { ShipmentState, initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { configureStore } from "@reduxjs/toolkit";
import { RenderOptions, render } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: { shipment: ShipmentState };
  store?: ReturnType<typeof configureStore>;
}

export const defaultActiveItem = {
  label: "New Samples",
  id: "new-sample",
  data: { type: "sample" },
} as TreeData<BaseShipmentItem>;

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = { shipment: { ...initialState, items: [] } },
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  const store = configureStore({ reducer: { shipment: shipmentSlice }, preloadedState });
  const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <Provider store={store}>{children}</Provider>
  );

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
