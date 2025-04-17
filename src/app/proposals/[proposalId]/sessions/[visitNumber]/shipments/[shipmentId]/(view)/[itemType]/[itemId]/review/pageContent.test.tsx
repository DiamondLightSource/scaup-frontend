import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { default as ReviewPageContent } from "./pageContent";
const params = {
  shipmentId: "1",
  itemId: "1",
  itemType: "grid",
  proposalId: "cm1",
  visitNumber: "1",
};

describe("Review Page", () => {
  it("should display 'human' value of field if field is prepopulated with external data", async () => {
    renderWithProviders(
      <ReviewPageContent
        params={params}
        prepopData={{ proteins: [{ name: "Proteinase K", proteinId: 1 }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            items: [
              {
                id: 1,
                name: "Sample",
                data: { type: "grid", proteinId: 1 },
              },
            ],
          },
        },
      },
    );

    await screen.findByText(/proteinase k/i);
  });
});
