import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { puck, renderWithProviders, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import ItemFormPageContent from "./pageContent";

describe("Item Page", () => {
  // Must come first, https://github.com/mswjs/msw/issues/43
  it("should add item to unassigned if in creation mode", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            samples: [
              {
                name: "new-sample",
                id: 123,
                data: { type: "sample", film: "Holey carbon", foil: "Quantifoil copper" },
              },
            ],
          }),
          ctx.delay(0),
        ),
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

    fireEvent.click(screen.getByText(/add/i));

    await screen.findByText(/save/i);

    const unassignedSamples = store.getState().shipment.unassigned[0].children![0].children;

    expect(unassignedSamples!).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({ film: "Holey carbon", foil: "Quantifoil copper" }),
        }),
      ]),
    );
  });

  it("should render form", () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
  });

  it("should delete item and reset form to new item", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: { ...initialState, items: [sample], activeItem: sample, isEdit: true },
      },
    });

    await screen.findByText(/sample-1/i);
    fireEvent.click(screen.getByText(/delete/i));

    await screen.findByText("New Sample");
  });

  it("should add item to shipment items if in creation mode and item is a root item", async () => {
    const newDewar: TreeData<BaseShipmentItem> = {
      id: "new-dewar",
      name: "",
      data: { type: "dewar" },
    };

    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            children: [newDewar],
          }),
          ctx.delay(0),
        ),
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          items: [],
          activeItem: newDewar,
        },
      },
    });

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(0));

    fireEvent.click(screen.getByText(/add/i));

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(1));
  });

  it("should add item to shipment items if in creation mode and item is a root item", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            samples: [{ name: "new-name", id: "123", data: { type: "sample" } }],
          }),
        ),
      ),
    );

    server.use(
      rest.post("http://localhost/api/shipments/:shipmentId/samples", (req, res, ctx) =>
        res.once(
          ctx.status(201),
          ctx.json({ id: "123", name: "new-name", data: { type: "sample" } }),
        ),
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
      expect(store.getState().shipment.unassigned[0].children![0].children![0].name).toBe(
        "new-name",
      ),
    );

    expect(store.getState().shipment.unassigned[0].children![0].children![0].id).toBe("123");
  });

  it("should trigger update of stored items on save", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            children: [
              { id: "456", name: "", data: { type: "sample", foil: "Quantifoil copper" } },
            ],
          }),
        ),
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          items: [{ id: "456", name: "", data: { type: "sample" } }],
          activeItem: { id: "456", name: "", data: { type: "sample" } },
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

  it("should update form if container type changes", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: puck,
        },
      },
    });

    expect(screen.getByText(/registered container/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox", { name: "Type" }), {
      target: { value: "falconTube" },
    });

    expect(screen.queryByText(/registered container/i)).not.toBeInTheDocument();
  });
});
