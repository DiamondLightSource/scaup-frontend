import { ItemLayoutContent } from "./layoutContent";
import { puck, renderWithProviders } from "@/utils/test-utils";
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

describe("Inventory Item Layout Content", () => {
  it("should populate store with passed containers", () => {
    const { store } = renderWithProviders(
      <ItemLayoutContent params={params} shipmentData={baseShipment}>
        <></>
      </ItemLayoutContent>,
    );

    expect(store.getState().shipment.items![0].children).toHaveLength(1);
  });

  it("should switch to active item when clicked", () => {
    renderWithProviders(
      <ItemLayoutContent params={params} shipmentData={baseShipment}>
        <></>
      </ItemLayoutContent>,
    );

    fireEvent.click(screen.getByLabelText("Expand dewar"));

    fireEvent.click(screen.getByText("puck"));
    expect(mockRouter.pathname).toBe("/puck/9");
  });
});
