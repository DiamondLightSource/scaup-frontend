import { BaseContainerProps } from "@/components/containers";
import { TreeData } from "@/components/visualisation/treeView";
import shipmentSlice, { ShipmentState, initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { configureStore } from "@reduxjs/toolkit";
import { RenderOptions, render } from "@testing-library/react";
import { MockedRequest, matchRequestUrl } from "msw";
import React, { PropsWithChildren } from "react";
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

/** Render provided component with form context (passed in the form of a provider) */
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

/** Render provided component with form context and store */
export const renderWithFormAndStore = (
  ui: React.ReactElement<BaseContainerProps>,
  {
    preloadedState = { shipment: { ...initialState, items: [] } },
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  const store = configureStore({ reducer: { shipment: shipmentSlice }, preloadedState });
  const Wrapper = ({ children }: PropsWithChildren<{}>) => {
    const formContext = useForm<BaseShipmentItem>();
    return (
      <FormProvider {...formContext}>
        <Provider store={store}>{children}</Provider>
      </FormProvider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

/** Render provided component with form context (passed as prop) and store */
export const renderAndInjectForm = (
  ui: React.ReactElement<BaseContainerProps>,
  {
    preloadedState = { shipment: { ...initialState, items: [] } },
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  const store = configureStore({ reducer: { shipment: shipmentSlice }, preloadedState });
  const Wrapper = ({ children }: PropsWithChildren<{}>) => {
    const formContext = useForm<BaseShipmentItem>();
    return (
      <FormProvider {...formContext}>
        <Provider store={store}>{React.cloneElement(ui, { ...ui.props, formContext })}</Provider>
      </FormProvider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const gridBox: TreeData<BaseShipmentItem> = {
  id: 3,
  name: "gridBox",
  data: { type: "gridBox" },
};

export const sample: TreeData<BaseShipmentItem> = {
  id: 5,
  name: "sample-1",
  data: { type: "sample" },
};

export const puck: TreeData<BaseShipmentItem> = {
  id: 9,
  name: "puck",
  data: { type: "puck", registeredContainer: "DLS-0001" },
};

export const waitForRequest = (method: string, url: string) => {
  let requestId = "";

  return new Promise<MockedRequest>((resolve, reject) => {
    server.events.on("request:start", (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase();

      const matchesUrl = matchRequestUrl(req.url, url).matches;

      if (matchesMethod && matchesUrl) {
        requestId = req.id;
      }
    });

    server.events.on("request:match", (req) => {
      if (req.id === requestId) {
        resolve(req);
      }
    });

    server.events.on("request:unhandled", (req) => {
      if (req.id === requestId) {
        reject(new Error(`The ${req.method} ${req.url.href} request was unhandled.`));
      }
    });
  });
};
