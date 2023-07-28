import { initialState } from "@/features/shipment/shipmentSlice";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import ItemFormPage from "./page";

describe("Item Page", () => {
  it("should render form", () => {
    renderWithProviders(<ItemFormPage />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
  });

  it("should render update active item if in edit mode", async () => {
    /*const { store } = renderWithProviders(<ItemFormPage />);

    fireEvent.click(screen.getByText(/edit/i));

    await waitFor(() =>
      expect(store.getState().shipment.activeItem.data).toMatchObject({ foil: "" }),
    );*/
  });

  it("should add item to unassigned if in creation mode", async () => {
    const { store } = renderWithProviders(<ItemFormPage />);

    fireEvent.click(screen.getByText(/add/i));

    await waitFor(() =>
      expect(store.getState().shipment.unassigned[0].children![0].children).toHaveLength(1),
    );

    const unassignedSamples = store.getState().shipment.unassigned[0].children![0].children;

    expect(unassignedSamples!).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({ film: "Holey carbon", foil: "Quantifoil copper" }),
        }),
      ]),
    );
  });

  it("should add item to shipment items if in creation mode and item is a root item", async () => {
    const { store } = renderWithProviders(<ItemFormPage />, {
      preloadedState: {
        shipment: {
          ...initialState,
          items: [],
          activeItem: { id: "new-dewar", label: "", data: { type: "dewar" } },
        },
      },
    });

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(0));

    fireEvent.click(screen.getByText(/add/i));

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(1));
  });
});
