import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ItemFormPageContent from "./pageContent";

const unassignedSampleApiReturn = {
  samples: [
    {
      name: "new-sample",
      id: 123,
      data: { type: "sample", film: "Holey carbon", foil: "Quantifoil copper" },
    },
  ],
};

describe("Item Page", () => {
  // Must come first, https://github.com/mswjs/msw/issues/43
  it("should render form", () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
  });

  /*it("should delete item and reset form to new item", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: { ...initialState, items: [sample], activeItem: sample, isEdit: true },
      },
    });

    await screen.findByText(/sample-1/i);
    fireEvent.click(screen.getByText(/delete/i));

    await screen.findByText("New Sample");
  });*/

  it("should add item to shipment items if in creation mode and item is a root item", async () => {
    const newDewar: TreeData<BaseShipmentItem> = {
      id: "new-dewar",
      name: "",
      data: { type: "dewar" },
    };

    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: [newDewar] }),
        { once: true },
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          items: [],
          activeItem: newDewar,
        },
      },
    });

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(0));

    fireEvent.click(screen.getAllByText(/add/i)[1]);

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(1));
  });

  it("should add item to shipment items if in creation mode and item is a root item", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId/unassigned",
        () =>
          HttpResponse.json({
            samples: [{ name: "new-name", id: "123", data: { type: "sample" } }],
          }),
        { once: true },
      ),
      http.post(
        "http://localhost/api/shipments/:shipmentId/samples",
        () =>
          HttpResponse.json(
            { id: "123", name: "new-name", data: { type: "sample" } },
            { status: 201 },
          ),
        { once: true },
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
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
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () =>
          HttpResponse.json({
            children: [
              { id: "456", name: "", data: { type: "sample", foil: "Quantifoil copper" } },
            ],
          }),
        { once: true },
      ),
    );

    const { store } = renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
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
          ...testInitialState,
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

  it("should update active item if new item is added", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/samples",
        () => HttpResponse.json({ id: 456 }, { status: 201 }),
        { once: true },
      ),
    );

    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "New Name" },
    });

    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() => expect(mockRouter.pathname).toBe("/456/edit"));
  });

  it("should go to new item page if 'new item' clicked", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          isEdit: true,
        },
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /create new item/i,
      }),
    );
    screen.logTestingPlaygroundURL();
    await waitFor(() => expect(mockRouter.pathname).toBe("/new/edit"));
  });
});
