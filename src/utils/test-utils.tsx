import { TreeData } from "@/components/visualisation/treeView";
import shipmentSlice, { ShipmentState, initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { configureStore } from "@reduxjs/toolkit";
import { RenderOptions, render } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Provider } from "react-redux";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: { shipment: ShipmentState };
  store?: ReturnType<typeof configureStore>;
}

export const defaultActiveItem = {
  name: "New Samples",
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

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const renderWithForm = (ui: React.ReactElement, renderOptions?: RenderOptions) => {
  const Wrapper = ({ children }: PropsWithChildren) => {
    const formContext = useForm();
    return (
      <FormProvider {...formContext}>
        <form>{children}</form>
      </FormProvider>
    );
  };

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const renderWithStoreAndForm = (
  ui: React.ReactElement,
  {
    preloadedState = { shipment: { ...initialState, items: [] } },
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  const store = configureStore({ reducer: { shipment: shipmentSlice }, preloadedState });
  const Wrapper = ({ children }: PropsWithChildren<{}>) => {
    const formContext = useForm();
    return (
      <FormProvider {...formContext}>
        <Provider store={store}>{children}</Provider>
      </FormProvider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const gridBox = {
  id: 3,
  name: "gridBox",
  data: { type: "gridBox" },
} as TreeData<BaseShipmentItem>;

export const sample = {
  id: 5,
  name: "sample-1",
  data: { type: "sample" },
} as TreeData<BaseShipmentItem>;
