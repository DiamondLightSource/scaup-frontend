import { fireEvent, waitFor, screen } from "@testing-library/react";
import { ItemFormPageContent } from "./pageContent";
import mockRouter from "next-router-mock";
import { renderWithProviders, testInitialState } from "@/utils/test-utils";

const params = { itemType: "dewar", itemId: "1", topLevelContainerId: "1" };
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
    renderWithProviders(<ItemFormPageContent params={params} />, {
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
    renderWithProviders(<ItemFormPageContent params={params} />, {
      preloadedState: baseShipment,
    });

    await screen.findByRole("button", { name: "Add" });
  });

  it("should redirect once item is created", async () => {
    renderWithProviders(
      <ItemFormPageContent params={{ itemType: "puck", itemId: "2", topLevelContainerId: "1" }} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/1"));
  });

  it("should redirect once item is saved", async () => {
    renderWithProviders(
      <ItemFormPageContent params={{ itemType: "puck", itemId: "2", topLevelContainerId: "1" }} />,
      {
        preloadedState: {
          shipment: {
            ...baseShipment.shipment,
            isEdit: true,
          },
        },
      },
    );

    fireEvent.click(await screen.findByRole("button", { name: "Save" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/2"));
  });

  it("should redirect to new item when button is clicked", async () => {
    renderWithProviders(
      <ItemFormPageContent params={{ itemType: "puck", itemId: "2", topLevelContainerId: "1" }} />,
      {
        preloadedState: {
          shipment: {
            ...baseShipment.shipment,
            isEdit: true,
          },
        },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Create New Item" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/new"));
  });

  it("should disable 'create new item' button if item is sample/grid/dewar", async () => {
    renderWithProviders(<ItemFormPageContent params={params} />);

    expect(screen.getByRole("button", { name: "Create New Item" })).toHaveAttribute("disabled");
  });
});
