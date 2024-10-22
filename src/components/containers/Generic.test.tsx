import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { gridBox, renderAndInjectForm, renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { GenericContainer } from "@/components/containers/Generic";
import { setLocationMock } from "@/components/containers/__mocks__";

vi.mock("@/components/containers");

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

describe("Generic Container", () => {
  it("should fire creation callback if apply clicked", async () => {
    renderAndInjectForm(<GenericContainer parentId='1' />, {
      preloadedState: { shipment: { ...defaultShipment.shipment } },
    });

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());

    expect(setLocationMock).toHaveBeenCalledWith(123, expect.objectContaining({ id: 3 }));
  });

  it("should populate slots with data from state", () => {
    renderAndInjectForm(<GenericContainer parentId='1' />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    screen.getByText(/gridbox/i);
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });

  it("should display containers as children if parent is top level container", async () => {
    const unassignedContainers = structuredClone(defaultShipment);

    unassignedContainers.shipment.unassigned[0].children![
      getCurrentStepIndex("falconTube")
    ].children!.push(falconTube);

    renderAndInjectForm(
      <GenericContainer parentId='1' child='containers' parent='topLevelContainers' />,
      {
        preloadedState: unassignedContainers,
      },
    );

    fireEvent.click(screen.getByText(/add/i));
    await screen.findByText("Container");
  });

  it("should fire remove callback when remove is clicked", () => {
    renderAndInjectForm(<GenericContainer parentId='1' />, {
      preloadedState: {
        shipment: {
          ...initialState,
          activeItem: populatedContainer,
          isEdit: true,
        },
      },
    });

    fireEvent.click(screen.getByText("Remove"));

    expect(setLocationMock).toHaveBeenCalledWith(null, expect.objectContaining({ id: 3 }));
  });

  it("should not render remove/add buttons if form context is not present", () => {
    renderWithProviders(<GenericContainer parentId='1' />, {});

    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/add/i)).not.toBeInTheDocument();
  });
});
