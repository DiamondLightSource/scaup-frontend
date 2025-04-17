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
        name: "first-dewar",
        children: [{ id: 2, data: { type: "puck" }, name: "puck" }],
      },
    ],
  },
};

const params = {
  shipmentId: "1",
  itemId: "2",
  itemType: "puck",
  proposalId: "cm1",
  visitNumber: "1",
};

describe("Item Page Content", () => {
  it("should redirect once item is created", async () => {
    renderWithProviders(
      <ItemFormPageContent
        params={{ ...params, itemId: "new", itemType: "puck" }}
        prepopData={{}}
      />,
      {
        preloadedState: baseShipment,
      },
    );

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/123/edit"));
  });

  it("should redirect once item is saved", async () => {
    renderWithProviders(<ItemFormPageContent params={params} prepopData={{}} />, {
      preloadedState: baseShipment,
    });

    await screen.findByText("Puck");

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/puck/2/edit"));
  });
});
