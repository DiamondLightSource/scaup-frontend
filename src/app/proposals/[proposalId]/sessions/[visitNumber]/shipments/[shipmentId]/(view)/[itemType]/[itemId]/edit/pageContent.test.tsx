import { fireEvent, waitFor, screen } from "@testing-library/react";
import ItemFormPageContent from "./pageContent";
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

describe("Item Page Content", () => {
  it("should redirect once item is created", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          activeItem: puck,
        },
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/123/edit"));
  });

  it("should redirect once item is saved", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...baseShipment.shipment,
          isEdit: true,
          activeItem: puck,
        },
      },
    });

    fireEvent.click(await screen.findByRole("button", { name: "Save" }));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/9/edit"));
  });
});
