import { GridBox } from "@/components/containers/gridBox";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { gridBox, renderAndInjectForm, renderWithFormAndStore, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { Controller, useFormContext } from "react-hook-form";

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
  it("should show modal when grid is clicked", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: defaultShipment },
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/select item/i)).toBeInTheDocument();
  });

  it("should pre-populate positions with data from state", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByTestId("2-populated"));
  });

  it("should display message if no unassigned samples are available", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
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

    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText(/sample-1/i));

    await screen.findByTestId("2-populated");
  });

  it("should remove sample from position when remove clicked", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: defaultShipment.items })),
      ),
    );
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await screen.findByTestId("2-empty");
  });

  it("should render four grid slots by default", () => {
    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("should derive capacity from sibling form component", async () => {
    const FormParent = () => {
      const formContext = useFormContext<BaseShipmentItem>();
      return (
        <>
          <Controller
            name='capacity'
            render={({ field }) => <input data-testid='cap' {...field} value='3'></input>}
          ></Controller>
          <GridBox shipmentId='1' formContext={formContext} />
        </>
      );
    };

    renderWithFormAndStore(<FormParent />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.change(screen.getByTestId("cap"), { target: { value: "5" } });
    await waitFor(() => expect(screen.getAllByRole("button")).toHaveLength(5));
  });

  it("should create grid box if not yet in database before populating slot", async () => {
    const newPopulatedGridBoxItems = structuredClone(populatedGridBoxShipment.items);

    newPopulatedGridBoxItems[0].children[0].children.push({ ...populatedGridBox, id: 123 });

    server.use(
      rest.post("http://localhost/api/shipments/:shipmentId/containers", (req, res, ctx) =>
        res.once(ctx.status(201), ctx.json({ id: 123 })),
      ),
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: newPopulatedGridBoxItems })),
      ),
    );

    renderAndInjectForm(<GridBox shipmentId='1' />, {
      preloadedState: {
        shipment: { ...defaultShipment, activeItem: { ...gridBox, id: "new-gridBox" } },
      },
    });

    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText(/sample-1/i));

    await screen.findByTestId("2-populated");
  });
});
