import { steps } from "@/mappings/pages";
import { renderWithProviders, testInitialState } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { default as ReviewPageContent } from "./pageContent";

describe("Review Page", () => {
  // Must come first, https://github.com/mswjs/msw/issues/43
  it("should set store page to step length + 1 by default", () => {
    const { store } = renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={{}} />);

    expect(store.getState().shipment.currentStep === steps.length + 1);
  });

  /*it("should display first item of shipment as active item by default", () => {
    renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          items: [{ id: "dewar", name: "First Dewar", data: { type: "dewar" }, children: [puck] }],
        },
      },
    });

    expect(screen.getByText(/first dewar/i)).toBeInTheDocument();
  });*/

  it("should display 'human' value of field if field is prepopulated with external data", () => {
    renderWithProviders(
      <ReviewPageContent
        shipmentId='1'
        prepopData={{ labContacts: [{ cardName: "John Doe", labContactId: 1 }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: {
              id: "dewar",
              name: "First Dewar",
              data: { type: "dewar", labContact: 1 },
            },
          },
        },
      },
    );

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});
