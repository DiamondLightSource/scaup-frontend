import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { gridBox, renderWithStoreAndForm } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { GenericContainer } from "./generic";

const defaultShipment = { shipment: structuredClone(initialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("gridBox")].children!.push(
  gridBox,
);

const falconTube = {
  id: 123,
  name: "container",
  data: { type: "falconTube" },
  children: [],
};

defaultShipment.shipment.activeItem = falconTube as TreeData<BaseShipmentItem>;

const populatedContainer = { ...falconTube, children: [gridBox] } as TreeData<BaseShipmentItem>;

const populatedContainerShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [populatedContainer],
  },
];

describe("Generic Container", () => {
  it("should create container if not yet in database before populating slot", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: populatedContainerShipment })),
      ),
    );

    renderWithStoreAndForm(<GenericContainer shipmentId='1' />, {
      preloadedState: defaultShipment,
    });

    fireEvent.click(screen.getByText(/add/i));
    fireEvent.click(screen.getByText(/gridbox/i));

    await screen.findByText(/remove/i);
  });

  it("should add item to container and update", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: populatedContainerShipment })),
      ),
    );

    renderWithStoreAndForm(<GenericContainer shipmentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText(/add/i));
    fireEvent.click(screen.getByText(/gridbox/i));

    await screen.findByText(/remove/i);
  });

  it("should populate slots with data from state", () => {
    renderWithStoreAndForm(<GenericContainer shipmentId='1' />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    screen.getByText(/gridbox/i);
    screen.getByText(/remove/i);
  });

  it("should remove item when remove is clicked", async () => {
    const unpopulatedContainerShipment = structuredClone(populatedContainerShipment);
    unpopulatedContainerShipment[0].children[0].children = [];

    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ children: unpopulatedContainerShipment })),
      ),
    );

    renderWithStoreAndForm(<GenericContainer shipmentId='1' />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByText(/remove/i));
    await waitFor(() => expect(screen.queryByText(/gridbox/i)).not.toBeInTheDocument());
  });
});
