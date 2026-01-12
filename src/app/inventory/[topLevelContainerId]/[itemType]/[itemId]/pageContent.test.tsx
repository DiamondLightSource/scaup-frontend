import { fireEvent, waitFor, screen } from "@testing-library/react";
import { ItemFormPageContent } from "./pageContent";
import mockRouter from "next-router-mock";
import { renderWithProviders, testInitialState } from "@/utils/test-utils";

const params = { itemType: "puck", itemId: "2", topLevelContainerId: "1" };
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
  it("should redirect once item is saved", async () => {
    renderWithProviders(<ItemFormPageContent params={params} />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/2"));
  });

  it("should display message if item does not exist", async () => {
    renderWithProviders(<ItemFormPageContent params={{ ...params, itemId: "new" }} />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          activeItem: null,
        },
      },
    });

    expect(screen.getByText("No item selected")).toBeInTheDocument();
  });
});
