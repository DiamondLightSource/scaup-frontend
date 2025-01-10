import { Puck } from "@/components/containers/Puck";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { gridBox, puck, renderAndInjectForm, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { setLocationMock } from "@/components/containers/__mocks__";

vi.mock("@/components/containers");

const defaultShipment = { shipment: structuredClone(testInitialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("gridBox")].children!.push(
  gridBox,
);

defaultShipment.shipment.activeItem = puck;

const populatedContainer = {
  ...puck,
  children: [{ ...gridBox, data: { location: 5 } }],
} as TreeData<BaseShipmentItem>;

describe("Puck", () => {
  it.each([
    { count: 12, type: "1" },
    { count: 12, type: "2" },
  ])("should render $type subtype", ({ count, type }) => {
    renderAndInjectForm(<Puck parentId='1' containerSubType={type} />);
    expect(screen.getAllByRole("button")).toHaveLength(count);
  });

  it("should display message if there are more children than grid box positions", () => {
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

  it("should fire creation callback when apply is clicked", async () => {
    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment, isEdit: true } },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());

    expect(setLocationMock).toHaveBeenCalledWith(9, expect.objectContaining({ id: 3 }), 0);
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

  it("should render cross sample collection child selector if parent type is 'topLevelContainer'", () => {
    renderAndInjectForm(<Puck parentId='1' parentType='topLevelContainer' />);

    fireEvent.click(screen.getByTestId("5-empty"));
    screen.getByText("Select");
  });

  it("should fire remove callback when remove is clicked", async () => {
    renderAndInjectForm(<Puck parentId='1' />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());

    expect(setLocationMock).toHaveBeenCalledWith(null, expect.objectContaining({ id: 3 }), null);
  });
});
