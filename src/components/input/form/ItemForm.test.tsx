import { fireEvent, screen } from "@testing-library/react";
import { ItemForm } from "@/components/input/form/ItemForm";
import mockRouter from "next-router-mock";
import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";

const baseShipment = {
  shipment: {
    ...testInitialState,
    items: [
      {
        id: 1,
        data: { type: "dewar" },
        name: "dewar",
        children: [{ id: 2, data: { type: "puck" }, name: "puck" }],
      },
    ],
  },
};

describe("Inventory Item Page Content", () => {
  it("should show 'save' button if current item is in edit mode", () => {
    renderWithProviders(<ItemForm parentId='1' onSubmit={async () => {}} />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          isEdit: true,
        },
      },
    });

    screen.getByText("Save");
  });

  it("should show 'add' button if current item is not in edit mode", () => {
    renderWithProviders(<ItemForm parentId='1' onSubmit={async () => {}} />, {
      preloadedState: baseShipment,
    });

    screen.getByText("Add");
  });

  it("should redirect to new/edit item when button is clicked and parent is shipment", () => {
    renderWithProviders(<ItemForm parentId='1' onSubmit={async () => {}} parentType='shipment' />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByText("Create New Item"));
    expect(mockRouter.pathname).toBe("/new/edit");
  });

  it("should disable 'create new item' button if parent is internal top level container", () => {
    renderWithProviders(
      <ItemForm parentId='1' parentType='topLevelContainer' onSubmit={async () => {}} />,
      {
        preloadedState: {
          shipment: {
            ...baseShipment.shipment,
            isEdit: true,
          },
        },
      },
    );

    expect(screen.getByText("Create New Item")).toHaveAttribute("disabled");
  });

  it("should disable 'add' button if item is sample/grid/dewar and it is not an existing item", () => {
    renderWithProviders(
      <ItemForm parentId='1' parentType='topLevelContainer' onSubmit={async () => {}} />,
      {
        preloadedState: {
          shipment: {
            ...baseShipment.shipment,
            isEdit: false,
          },
        },
      },
    );

    expect(screen.getByText("Add")).toHaveAttribute("disabled");
  });

  it("should disable code field if item is inventory dewar", () => {
    renderWithProviders(
      <ItemForm parentId='1' onSubmit={async () => {}} parentType='topLevelContainer' />,
      {
        preloadedState: {
          shipment: {
            ...baseShipment.shipment,
            activeItem: { id: 1, data: { type: "dewar" }, name: "dewar" },
          },
        },
      },
    );

    screen.getByRole("combobox", { name: "Dewar Code" }).hasAttribute("disabled");
  });
});
