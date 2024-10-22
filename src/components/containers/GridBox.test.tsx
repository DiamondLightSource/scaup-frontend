import { GridBox } from "@/components/containers/GridBox";
import { initialState } from "@/features/shipment/shipmentSlice";
import { gridBox, renderAndInjectForm, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { setLocationMock } from "@/components/containers/__mocks__";

vi.mock("@/components/containers");

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
  isEdit: true,
} satisfies typeof initialState;

describe("Grid Box", () => {
  it("should show modal when grid is clicked", () => {
    renderAndInjectForm(<GridBox parentId='1' />);

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/select sample/i)).toBeInTheDocument();
  });

  it("should pre-populate positions with data from state", () => {
    renderAndInjectForm(<GridBox parentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    expect(screen.getByTestId("1-populated")).toBeInTheDocument();
  });

  it("should display message if no unassigned samples are available", () => {
    renderAndInjectForm(<GridBox parentId='1' />);

    fireEvent.click(screen.getByText("1"));

    expect(screen.getByText(/no unassigned samples available/i));
  });

  it("should fire location callback when apply clicked", async () => {
    renderAndInjectForm(<GridBox parentId='1' />, {
      preloadedState: {
        shipment: { ...defaultShipment, isEdit: false, unassigned: defaultShipment.unassigned },
      },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText(/apply/i));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());

    expect(setLocationMock).toHaveBeenCalledWith(3, expect.objectContaining({ id: 5 }), 0);
  });

  it("should fire remove callback when remove clicked", async () => {
    renderAndInjectForm(<GridBox parentId='1' />, {
      preloadedState: { shipment: populatedGridBoxShipment },
    });

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());

    expect(setLocationMock).toHaveBeenCalledWith(null, expect.objectContaining({ id: 5 }), null);
  });

  it("should render four grid slots by default", () => {
    renderAndInjectForm(<GridBox parentId='1' />);

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("should render sample selector if parent is top level container", () => {
    renderAndInjectForm(<GridBox parentId='1' parentType='topLevelContainer' />);

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText(/proposal reference/i)).toBeInTheDocument();
  });

  it.each([
    { count: 4, type: "1" },
    { count: 8, type: "2" },
    { count: 6, type: "3" },
    { count: 12, type: "4" },
    { count: 4, type: "auto" },
  ])("should render $type subtype", ({ count, type }) => {
    renderAndInjectForm(<GridBox parentId='1' containerSubType={type} />);
    expect(screen.getAllByRole("button")).toHaveLength(count);
  });

  it("should display message if there are more children than grid box positions", async () => {
    const modifiedShipment = structuredClone(populatedGridBoxShipment);
    modifiedShipment.activeItem.children[0].data.location = 6;

    renderAndInjectForm(<GridBox parentId='1' parentType='topLevelContainer' />, {
      preloadedState: { shipment: modifiedShipment },
    });

    expect(screen.getByText(/remove sample/i)).toBeInTheDocument();
  });
});
