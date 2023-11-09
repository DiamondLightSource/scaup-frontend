import { initialState } from "@/features/shipment/shipmentSlice";
import { steps } from "@/mappings/pages";
import { puck, renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { default as ReviewPageContent } from "./pageContent";

const unassignedSampleApiReturn = {
  samples: [
    {
      name: "new-sample",
      id: 123,
      data: { type: "sample", film: "Holey carbon", foil: "Quantifoil copper" },
    },
  ],
};

describe("Review Page", () => {
  // Must come first, https://github.com/mswjs/msw/issues/43
  it("should set store page to step length + 1 by default", () => {
    const { store } = renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={{}} />);

    expect(store.getState().shipment.currentStep === steps.length + 1);
  });

  it("should display type of item in title", () => {
    renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: { name: "Protein 01", id: "sample", data: { type: "sample" } },
        },
      },
    });

    expect(screen.getByText(/sample/i)).toBeInTheDocument();
  });

  it("should display set first item of shipment as active item by default", () => {
    renderWithProviders(<ReviewPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          items: [{ id: "dewar", name: "First Dewar", data: { type: "dewar" }, children: [puck] }],
        },
      },
    });

    expect(screen.getByText(/first dewar/i)).toBeInTheDocument();
  });

  it("should display 'human' value of field if field is prepopulated with external data", () => {
    renderWithProviders(
      <ReviewPageContent
        shipmentId='1'
        prepopData={{ labContacts: [{ cardName: "John Doe", labContactId: 1 }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...initialState,
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
