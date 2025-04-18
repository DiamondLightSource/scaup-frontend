import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { puck, renderAndInjectForm, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { setLocationMock } from "@/components/containers/__mocks__";
import { GenericContainerWithPosition } from "@/components/containers/GenericWithPosition";

vi.mock("@/components/containers");

const defaultShipment = { shipment: structuredClone(testInitialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("puck")].children!.push(puck);

const populatedContainer = {
  name: "cane",
  id: 1,
  data: { type: "cane" },
  children: [{ ...puck, data: { location: 5 } }],
} as TreeData<BaseShipmentItem>;

defaultShipment.shipment.activeItem = populatedContainer;

describe("Generic Container with Positions", () => {
  it("should render however many passed slots", () => {
    renderAndInjectForm(<GenericContainerWithPosition parentId='1' capacity={10} />);

    expect(screen.getAllByRole("button")).toHaveLength(10);
  });

  it("should fire creation callback when apply is clicked", async () => {
    renderAndInjectForm(<GenericContainerWithPosition capacity={10} parentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment, isEdit: false } },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());

    expect(setLocationMock).toHaveBeenCalledWith(1, expect.objectContaining({ id: 9 }), 0);
  });

  it("should populate slots with data from state", () => {
    renderAndInjectForm(<GenericContainerWithPosition capacity={10} parentId='1' />, {
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

  it("should fire remove callback when remove is clicked", async () => {
    renderAndInjectForm(<GenericContainerWithPosition capacity={10} parentId='1' />, {
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

    expect(setLocationMock).toHaveBeenCalledWith(null, expect.objectContaining({ id: 9 }));
  });
});
