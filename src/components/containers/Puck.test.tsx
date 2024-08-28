import { Puck } from "@/components/containers/Puck";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { gridBox, puck, renderAndInjectForm, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";

const defaultShipment = { shipment: structuredClone(testInitialState) };

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

    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: defaultShipment,
    });

    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByTestId("5-populated");
  });

  it.each([
    { count: 12, type: "1" },
    { count: 12, type: "2" },
  ])("should render $type subtype", ({ count, type }) => {
    renderAndInjectForm(<Puck parentId='1' containerSubType={type} />);
    expect(screen.getAllByRole("button")).toHaveLength(count);
  });

  it("should display message if there are more children than grid box positions", async () => {
    const modifiedShipment = structuredClone(defaultShipment);
    modifiedShipment.shipment.activeItem = {
      ...populatedContainer,
      children: [{ name: "grid-box", id: 1, data: { location: 20 } }],
    };

    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: modifiedShipment,
    });

    expect(screen.getByText(/remove children/i)).toBeInTheDocument();
  });

  it("should add item to container and update", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ children: populatedContainerShipment }),
        { once: true },
      ),
    );

    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await screen.findByTestId("5-populated");
  });

  it("should populate slots with data from state", () => {
    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    screen.getByTestId("5-populated");
  });

  it("should render cross shipment child selector if parent type is 'topLevelContainer'", () => {
    renderAndInjectForm(<Puck parentId='1' parentType='topLevelContainer' />);

    fireEvent.click(screen.getByTestId("5-empty"));
    screen.getByRole("button", { name: "Select" });
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

    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByTestId("5-populated"));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await screen.findByTestId("6-empty");
  });
});
