import { ItemLayoutContent } from "./layoutContent";
import { puck, renderWithProviders, sample } from "@/utils/test-utils";
import { initialState } from "@/features/shipment/shipmentSlice";
import { getCurrentStepIndex } from "@/mappings/pages";
import { fireEvent, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

const params = { itemType: "puck", itemId: "2", topLevelContainerId: "1" };
const baseShipment = {
  id: 0,
  name: "Shipment",
  data: { type: "shipment" },
  children: [
    {
      id: 1,
      data: { type: "dewar" },
      name: "dewar",
      children: [puck],
    },
  ],
};

const defaultUnassigned = structuredClone(initialState.unassigned);
defaultUnassigned[0].children![getCurrentStepIndex("sample")].children!.push(sample);

const containerResponse = {
  items: [],
  total: 0,
  page: 0,
  limit: 25,
};

const filledContainerResponse = {
  ...containerResponse,
  items: [{ id: 1, name: "Container-123", data: { type: "puck" } }],
};

describe("Inventory Item Layout Content", () => {
  it("should populate store with passed containers", () => {
    const { store } = renderWithProviders(
      <ItemLayoutContent
        params={params}
        shipmentData={baseShipment}
        unassignedItems={filledContainerResponse}
      >
        <></>
      </ItemLayoutContent>,
    );

    expect(store.getState().shipment.unassigned[0].children![2].children).toHaveLength(1);
  });

  it("should reset unassigned containers", () => {
    const { store } = renderWithProviders(
      <ItemLayoutContent
        params={params}
        shipmentData={baseShipment}
        unassignedItems={containerResponse}
      >
        <></>
      </ItemLayoutContent>,
      { preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } } },
    );

    expect(store.getState().shipment.unassigned[0].children![0].children).toHaveLength(0);
  });

  it("should switch pages when step clicked", () => {
    renderWithProviders(
      <ItemLayoutContent
        params={params}
        shipmentData={baseShipment}
        unassignedItems={containerResponse}
      >
        <></>
      </ItemLayoutContent>,
    );

    fireEvent.click(screen.getByText("Pucks"));
    expect(mockRouter.pathname).toBe("/puck/new");
  });

  it("should switch to active item when clicked", () => {
    renderWithProviders(
      <ItemLayoutContent
        params={params}
        shipmentData={baseShipment}
        unassignedItems={filledContainerResponse}
      >
        <></>
      </ItemLayoutContent>,
    );

    fireEvent.click(screen.getByText("Container-123"));
    expect(mockRouter.pathname).toBe("/puck/1");
  });
});
