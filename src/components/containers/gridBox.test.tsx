import { TreeData } from "@/components/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { GridBox } from "./gridBox";

const gridBox = {
  id: "gridBox",
  label: "gridBox",
  data: { type: "gridBox" },
} as TreeData<BaseShipmentItem>;

const defaultShipment = {
  ...initialState,
  items: [
    {
      id: "dewar",
      label: "dewar",
      data: { type: "dewar" },
      children: [
        {
          id: "container",
          label: "container",
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
          id: "samples",
          label: "samples",
          data: {},
          children: [{ id: "sample-1", label: "sample-1", data: { type: "sample" } }],
        },
      ],
    },
  ],
} satisfies typeof initialState;

describe("Grid Box", () => {
  it("should render all grid positions", () => {
    renderWithProviders(<GridBox positions={4} />, {
      preloadedState: { shipment: defaultShipment },
    });

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("should show modal when grid is clicked", () => {
    renderWithProviders(<GridBox positions={4} />, {
      preloadedState: { shipment: defaultShipment },
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/select item/i)).toBeInTheDocument();
  });

  it("should populate position with clicked sample", () => {
    renderWithProviders(<GridBox positions={4} />, {
      preloadedState: { shipment: defaultShipment },
    });

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/select item/i)).toBeInTheDocument();
  });
});
