import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { prepopData, puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import mockRouter from "next-router-mock";

import { toastMock } from "@/../vitest.setup";
import ItemFormPageContent from "./pageContent";

const newPuck: TreeData<BaseShipmentItem> = {
  id: "new-puck",
  name: "puck-123",
  data: { type: "puck" },
};

describe("Item Page", () => {
  // Must come first, https://github.com/mswjs/msw/issues/43
  it("should render form", () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={{}} />);

    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Mesh")).toBeInTheDocument();
  });

  it("should display name of active item if editing", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={prepopData} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          isEdit: true,
          activeItem: newPuck,
        },
      },
    });

    await screen.findByDisplayValue("puck-123");
  });

  it("should reset name to empty if creating new item", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={prepopData} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          isEdit: true,
          activeItem: newPuck,
        },
      },
    });

    await screen.findByDisplayValue("puck-123");
    fireEvent.click(
      screen.getByRole("button", {
        name: /create new item/i,
      }),
    );

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("value", "");
  });

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

    const { store } = renderWithProviders(
      <ItemFormPageContent shipmentId='1' prepopData={prepopData} />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            items: [],
            activeItem: newDewar,
          },
        },
      },
    );

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(0));

    fireEvent.click(screen.getAllByText(/add/i)[1]);

    await waitFor(() => expect(store.getState().shipment.items).toHaveLength(1));
  });

  it("should display new children in parent item", async () => {
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

    const { store } = renderWithProviders(
      <ItemFormPageContent shipmentId='1' prepopData={prepopData} />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            items: [],
          },
        },
      },
    );

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

    const { store } = renderWithProviders(
      <ItemFormPageContent shipmentId='1' prepopData={prepopData} />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            items: [{ id: "456", name: "", data: { type: "sample" } }],
            activeItem: { id: "456", name: "", data: { type: "sample" } },
            isEdit: true,
          },
        },
      },
    );

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

  it("should update form if container type changes", () => {
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

  it("should disable name if registered container is selected", () => {
    renderWithProviders(
      <ItemFormPageContent
        shipmentId='1'
        prepopData={{ containers: [{ barcode: "DLS-01", actualBarcode: "DLS-01", comments: "" }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: puck,
          },
        },
      },
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Registered Container" }), {
      target: { value: "DLS-01" },
    });

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("disabled");
  });

  it("should update watched items with active items", () => {
    renderWithProviders(
      <ItemFormPageContent
        shipmentId='1'
        prepopData={{ containers: [{ barcode: "DLS-01", actualBarcode: "DLS-01", comments: "" }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            isEdit: true,
            activeItem: { ...puck, data: { ...puck.data, registeredContainer: "DLS-01" } },
          },
        },
      },
    );

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("disabled");
  });

  it("should reenable name if no registered container is selected", () => {
    renderWithProviders(
      <ItemFormPageContent
        shipmentId='1'
        prepopData={{ containers: [{ barcode: "DLS-01", actualBarcode: "DLS-01", comments: "" }] }}
      />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            activeItem: puck,
          },
        },
      },
    );

    const registeredContainerCombobox = screen.getByRole("combobox", {
      name: "Registered Container",
    });

    fireEvent.change(registeredContainerCombobox, {
      target: { value: "DLS-01" },
    });

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("disabled");

    fireEvent.change(registeredContainerCombobox, {
      target: { value: "" },
    });

    expect(screen.getByRole("textbox", { name: "Name" })).not.toHaveAttribute("disabled");
  });

  it("should update active item if new item is added", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/samples",
        () => HttpResponse.json({ id: 456 }, { status: 201 }),
        { once: true },
      ),
    );

    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={prepopData} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "New_Name" },
    });

    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() => expect(mockRouter.pathname).toBe("/grid/456/edit"));
  });

  it("should use first returned item if creating multiple items", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/samples",
        () => HttpResponse.json({ items: [{ id: 578 }, { id: 456 }] }, { status: 201 }),
        { once: true },
      ),
    );

    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={prepopData} />);

    fireEvent.click(screen.getByText(/add/i));
    await waitFor(() => expect(mockRouter.pathname).toBe("/grid/578/edit"));
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
    await waitFor(() => expect(mockRouter.pathname).toBe("/new/edit"));
  });

  it("should disable button whilst request to add item is being made", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/samples",
        async () => {
          await delay(200);
          HttpResponse.json({ id: 456 }, { status: 201 });
        },
        { once: true },
      ),
    );

    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={prepopData} />);

    const addButton = screen.getByText(/add/i);

    fireEvent.click(addButton);
    await waitFor(() => expect(addButton).toHaveProperty("disabled", true));
    await waitFor(() => expect(toastMock).toHaveBeenCalled());
  });
});

describe("Input Validation", () => {
  it("should not allow names that contain invalid characters", async () => {
    renderWithProviders(<ItemFormPageContent shipmentId='1' prepopData={prepopData} />);

    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "test 123" },
    });

    const addButton = screen.getByText(/add/i);

    fireEvent.click(addButton);
    await screen.findByTestId("error-message");
    expect(
      screen.getByText("Name must only contain alphanumeric characters and underscores"),
    ).toBeInTheDocument();
  });
});
