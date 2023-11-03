import { Puck } from "@/components/containers/puck";
import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { gridBox, puck, renderAndInjectForm } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { rest } from "msw";

const defaultShipment = { shipment: structuredClone(initialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("gridBox")].children!.push(
  gridBox,
);

defaultShipment.shipment.activeItem = puck;

const populatedContainer = {
  ...puck,
  children: [{ ...gridBox, data: { location: 5 } }],
} as TreeData<BaseShipmentItem>;

const populatedContainerShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [populatedContainer],
  },
];

describe("Puck", () => {
  it("should create container if not yet in database before populating slot", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: populatedContainerShipment })),
      ),

      rest.post("http://localhost/api/shipments/:shipmentId/containers", (req, res, ctx) =>
        res.once(ctx.status(201), ctx.json({ id: 9 })),
      ),
    );

    renderAndInjectForm(<Puck shipmentId='1' />, {
      preloadedState: defaultShipment,
    });

    fireEvent.click(screen.getByText("6"));
    fireEvent.click(screen.getByText(/gridbox/i));

    await screen.findByTestId("6-populated");
  });

  it("should render 16 puck slots", () => {
    renderAndInjectForm(<Puck shipmentId='1' />);

    expect(screen.getAllByRole("button")).toHaveLength(16);
    screen.getByTestId("1-empty");
    screen.getByTestId("16-empty");
  });

  it("should add item to container and update", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: populatedContainerShipment })),
      ),
    );

    renderAndInjectForm(<Puck shipmentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText("6"));
    fireEvent.click(screen.getByText(/gridbox/i));

    await screen.findByTestId("6-populated");
  });

  it("should populate slots with data from state", () => {
    renderAndInjectForm(<Puck shipmentId='1' />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    screen.getByTestId("6-populated");
  });

  it("should remove item when remove is clicked", async () => {
    const unpopulatedContainerShipment = structuredClone(populatedContainerShipment);
    unpopulatedContainerShipment[0].children[0].children = [];

    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: unpopulatedContainerShipment })),
      ),
    );

    renderAndInjectForm(<Puck shipmentId='1' />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByTestId("6-populated"));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await screen.findByTestId("6-empty");
  });
});
