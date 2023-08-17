import { initialState } from "@/features/shipment/shipmentSlice";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import ItemFormPageContent from "./pageContent";

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: () => ({ data: { accessToken: "abc" } }),
}));

describe("Item Page", () => {
  it("should render form", () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

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
    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

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
    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
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

  it("should add item to shipment items if in creation mode and item is a root item", async () => {
    server.use(
      rest.post("http://localhost/api/shipments/:shipmentId/samples", (req, res, ctx) =>
        res.once(ctx.status(201), ctx.json({ sampleId: "123", name: "new-name" })),
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          items: [],
        },
      },
    });

    await waitFor(() =>
      expect(store.getState().shipment.unassigned[0].children![0].children).toHaveLength(0),
    );

    fireEvent.click(screen.getByText(/add/i));

    await waitFor(() =>
      expect(store.getState().shipment.unassigned[0].children![0].children![0].label).toBe(
        "new-name",
      ),
    );

    expect(store.getState().shipment.unassigned[0].children![0].children![0].id).toBe("123");
  });

  it("should save changes in item to store", async () => {
    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          items: [{ id: "456", label: "", data: { type: "sample" } }],
          activeItem: { id: "456", label: "", data: { type: "sample" } },
          isEdit: true,
        },
      },
    });

    fireEvent.change(screen.getByRole("combobox", { name: "Foil" }), {
      value: "Quantifoil copper",
    });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() =>
      expect(store.getState().shipment.items![0].data).toMatchObject({
        foil: "Quantifoil copper",
      }),
    );
  });
});
