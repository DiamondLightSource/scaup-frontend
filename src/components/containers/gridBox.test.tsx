import { GridBox } from "@/components/containers/gridBox";
import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { rest } from "msw";

const gridBox = {
  id: "3",
  name: "gridBox",
  data: { type: "gridBox" },
} as TreeData<BaseShipmentItem>;

const sample = {
  id: "5",
  name: "sample-1",
  data: { type: "sample" },
} as TreeData<BaseShipmentItem>;

const defaultShipment = {
  ...initialState,
  items: [
    {
      id: "dewar",
      name: "dewar",
      data: { type: "dewar" },
      children: [
        {
          id: "container",
          name: "container",
          data: { type: "puck" },
          children: [gridBox],
        },
      ],
    },
  ],
  activeItem: gridBox,
  unassigned: [
    {
      ...initialState.unassigned[0],
      children: [
        {
          id: "sample",
          name: "Samples",
          data: {},
          children: [sample],
        },
        ...initialState.unassigned[0].children!.slice(1, 3),
      ],
    },
  ],
} satisfies typeof initialState;

const populatedGridBox = {
  ...gridBox,
  children: [{ ...sample, data: { ...sample.data, location: 1 } }],
};

const populatedGridBoxShipment = {
  ...initialState,
  activeItem: populatedGridBox,
  items: [
    {
      ...defaultShipment.items[0],
      children: [
        {
          ...defaultShipment.items[0].children[0],
          children: [populatedGridBox],
        },
      ],
    },
  ],
} satisfies typeof initialState;

describe("Grid Box", () => {
  it("should render all grid positions", () => {
    renderWithProviders(<GridBox positions={12} shipmentId='1' />, {
      preloadedState: { shipment: defaultShipment },
    });

    expect(screen.getAllByRole("button")).toHaveLength(12);
  });

  it("should show modal when grid is clicked", () => {
    renderWithProviders(<GridBox positions={4} shipmentId='1' />, {
      preloadedState: { shipment: defaultShipment },
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/select item/i)).toBeInTheDocument();
  });

  it("should pre-populate positions with data from state", () => {
    renderWithProviders(<GridBox positions={4} shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByTestId("1-populated"));
  });

  it("should display message if no unassigned samples are available", () => {
    renderWithProviders(<GridBox positions={4} shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/no unassigned samples available/i));
  });

  it("should refresh position with clicked sample", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: populatedGridBoxShipment.items })),
      ),
    );

    renderWithProviders(<GridBox positions={4} shipmentId='1' />, {
      preloadedState: { shipment: defaultShipment },
    });

    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText(/sample-1/i));

    await screen.findByTestId("1-populated");
  });

  it("should remove sample from position when remove clicked", async () => {
    renderWithProviders(<GridBox positions={4} shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await screen.findByTestId("1-empty");
  });
});
