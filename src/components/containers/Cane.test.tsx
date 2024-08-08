import { Cane } from "@/components/containers/Cane";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { puck, renderAndInjectForm, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

const defaultShipment = { shipment: structuredClone(testInitialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("puck")].children!.push(puck);

const populatedContainer = {
  name: "cane",
  id: 1,
  data: { type: "cane" },
  children: [{ ...puck, data: { location: 5 } }],
} as TreeData<BaseShipmentItem>;

defaultShipment.shipment.activeItem = populatedContainer;

const populatedContainerShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [populatedContainer],
  },
];

describe("Cane", () => {
  it("should create container if not yet in database before populating slot", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: populatedContainerShipment }),
        { once: true },
      ),

      http.post(
        "http://localhost/api/shipments/:shipmentId/containers",
        () => HttpResponse.json({ id: 9 }, { status: 201 }),
        { once: true },
      ),
    );

    renderAndInjectForm(<Cane parentId='1' />, {
      preloadedState: defaultShipment,
    });

    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByText("puck");
  });

  it("should render 10 cane slots", () => {
    renderAndInjectForm(<Cane parentId='1' />);

    expect(screen.getAllByRole("button")).toHaveLength(10);
  });

  it("should add item to container and update", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: populatedContainerShipment }),
        { once: true },
      ),
    );

    renderAndInjectForm(<Cane parentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByText("puck");
  });

  it("should populate slots with data from state", () => {
    renderAndInjectForm(<Cane parentId='1' />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    screen.getByText("puck");
  });

  it("should remove item when remove is clicked", async () => {
    const unpopulatedContainerShipment = structuredClone(populatedContainerShipment);
    unpopulatedContainerShipment[0].children[0].children = [];

    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: unpopulatedContainerShipment }),
        { once: true },
      ),
    );

    renderAndInjectForm(<Cane parentId='1' />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByText("puck"));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => expect(screen.queryByText("puck")).not.toBeInTheDocument());
  });
});
