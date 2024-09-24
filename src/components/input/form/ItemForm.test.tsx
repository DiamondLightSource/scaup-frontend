import { fireEvent, waitFor, screen } from "@testing-library/react";
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
  it("should show 'save' button if current item is in edit mode", async () => {
    renderWithProviders(<ItemForm parentId='1' onSubmit={async () => {}} />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          isEdit: true,
        },
      },
    });

    await screen.findByRole("button", { name: "Save" });
  });

  it("should show 'add' button if current item is not in edit mode", async () => {
    renderWithProviders(<ItemForm parentId='1' onSubmit={async () => {}} />, {
      preloadedState: baseShipment,
    });

    await screen.findByRole("button", { name: "Add" });
  });

  it("should redirect to new item when button is clicked", async () => {
    renderWithProviders(
      <ItemForm parentId='1' onSubmit={async () => {}} parentType='topLevelContainer' />,
      {
        preloadedState: {
          shipment: {
            ...baseShipment.shipment,
            activeItem: puck,
            isEdit: true,
          },
        },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Create New Item" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/new"));
  });

  it("should redirect to new/edit item when button is clicked and parent is shipment", async () => {
    renderWithProviders(<ItemForm parentId='1' onSubmit={async () => {}} parentType='shipment' />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create New Item" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/new/edit"));
  });

  it("should disable 'create new item' button if item is sample/grid/dewar", () => {
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

    expect(screen.getByRole("button", { name: "Create New Item" })).toHaveAttribute("disabled");
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
