import { TreeData } from "@/components/visualisation/treeView";
import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import ItemPageLayoutContent from "./layoutContent";

const defaultShipmentItems: TreeData[] = [
  {
    id: "",
    name: "",
    data: { type: "dewar" },
    children: [puck],
  },
];

describe("Item Page Layout", () => {
  it("should set item in path as active item if it exists", () => {
    const { store } = renderWithProviders(
      <ItemPageLayoutContent itemType='puck' itemId='9'>
        <></>
      </ItemPageLayoutContent>,
      { preloadedState: { shipment: { ...testInitialState, items: defaultShipmentItems } } },
    );

    expect(store.getState()).toMatchObject({
      shipment: { activeItem: { id: 9, data: { type: "puck" } } },
    });
  });

  it("should set active item to blank new item if item id is 'new'", () => {
    const { store } = renderWithProviders(
      <ItemPageLayoutContent itemType='puck' itemId='new'>
        <></>
      </ItemPageLayoutContent>,
      { preloadedState: { shipment: { ...testInitialState, items: defaultShipmentItems } } },
    );

    expect(store.getState()).toMatchObject({
      shipment: { activeItem: { id: "new-puck", data: { type: "puck" } }, isEdit: false },
    });
  });
});
