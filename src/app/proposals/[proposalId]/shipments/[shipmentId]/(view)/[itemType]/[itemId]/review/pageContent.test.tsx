import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { default as ReviewPageContent } from "./pageContent";

describe("Review Page", () => {
  // Must come first, https://github.com/mswjs/msw/issues/43

  it("should display first item of shipment as active item by default", () => {
    renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          items: [{ id: "99", name: "First Dewar", data: { type: "dewar" }, children: [puck] }],
        },
      },
    });

    expect(mockRouter.pathname).toBe("/dewar/99/review");
  });

  it("should display 'human' value of field if field is prepopulated with external data", () => {
    renderWithProviders(
      <ReviewPageContent
        shipmentId='1'
        prepopData={{ proteins: [{ name: "Proteinase K", proteinId: 1 }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: {
              id: "sample",
              name: "Sample",
              data: { type: "sample", proteinId: 1 },
            },
          },
        },
      },
    );

    expect(screen.getByText(/proteinase k/i)).toBeInTheDocument();
  });

  it("should redirect user to default shipment item if active item does not exist", () => {
    renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={[]} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          activeItem: {
            id: "doesnotexist",
            name: "doesnotexist",
            data: { type: "dewar" },
          },
          isEdit: false,
          items: [{ data: { type: "dewar" }, id: 5, name: "dewar" }],
        },
      },
    });

    expect(mockRouter.pathname).toBe("/dewar/5/review");
  });
});
