import { initialState } from "@/features/shipment/shipmentSlice";
import { ExtendedRenderOptions, puck, renderWithFormAndStore } from "@/utils/test-utils";
import { renderHook } from "@testing-library/react";
import { ChildLocationManagerProps, useChildLocationManager } from ".";
import { Item } from "@/utils/client/item";
import mockRouter from "next-router-mock";
import { useFormContext } from "react-hook-form";

vi.mock("@/utils/client/item", () => {
  return {
    Item: {
      create: vi.fn(() => ({ id: 5, type: "puck" })),
      patch: vi.fn(() => ({ id: 5, type: "puck" })),
    },
  };
});

const formContextMock = {
  getValues: () => ({ details: {}, type: "puck" }),
  handleSubmit: () => () => {},
  formState: {
    errors: undefined,
  },
};

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useFormContext: vi.fn(() => formContextMock),
  };
});

const generateHook = (
  hookProps: ChildLocationManagerProps,
  extendedRenderProps?: ExtendedRenderOptions,
) => {
  const { wrapper } = renderWithFormAndStore(<></>, extendedRenderProps);
  const { result, unmount } = renderHook(() => useChildLocationManager(hookProps), { wrapper });
  unmount();

  return result.current;
};

interface TestParameter {
  parentType: ChildLocationManagerProps["parentType"];
  [x: string]: any;
}

describe("Container Child Location Manager", () => {
  afterEach(() => {
    (Item.create as any).mockClear();
    (Item.patch as any).mockClear();
    (useFormContext as any).mockClear();
  });

  it.each<TestParameter>([
    { parentType: "shipment", urlSuffix: "/edit" },
    { parentType: "topLevelContainer", urlSuffix: "" },
  ])(
    "should create item (with root parent being $parentType)",
    async ({ urlSuffix, parentType }) => {
      const setLocation = generateHook({ parentId: "1", parentType });
      await setLocation(1, { id: 1, data: { type: "puck" }, name: "puck" }, 1);

      expect(mockRouter.pathname).toBe(`/puck/5${urlSuffix}`);
    },
  );

  it("should patch item if in edit mode", async () => {
    const setLocation = generateHook(
      { parentId: "1" },
      { preloadedState: { shipment: { ...initialState, activeItem: puck, isEdit: true } } },
    );
    await setLocation(1, { id: 1, data: { type: "puck" }, name: "puck" }, 1);

    expect(Item.patch).toHaveBeenCalledWith(
      9,
      { registeredContainer: "DLS-0001", type: "puck", subType: undefined },
      "containers",
    );

    expect(Item.patch).toHaveBeenCalledWith(1, { location: 2, parentId: 1 }, "containers");
  });

  it("should patch conflicting item if position is already occupied", async () => {
    const setLocation = generateHook(
      { parentId: "1" },
      {
        preloadedState: {
          shipment: {
            ...initialState,
            activeItem: {
              ...puck,
              children: [{ id: 5, name: "test", data: { type: "gridBox", location: 3 } }],
            },
            isEdit: true,
          },
        },
      },
    );
    await setLocation(1, { id: 1, data: { type: "puck" }, name: "puck" }, 2);

    expect(Item.patch).toHaveBeenCalledWith(
      9,
      { registeredContainer: "DLS-0001", type: "puck", subType: undefined },
      "containers",
    );

    expect(Item.patch).toHaveBeenCalledWith(5, { location: null, parentId: null }, "containers");

    expect(Item.patch).toHaveBeenCalledWith(1, { location: 3, parentId: 1 }, "containers");
  });

  it("should not proceed if form errors exist", async () => {
    (useFormContext as any).mockImplementation(() => ({
      ...formContextMock,
      formState: { errors: "foo" },
    }));
    const setLocation = generateHook(
      { parentId: "1" },
      { preloadedState: { shipment: { ...initialState, activeItem: puck, isEdit: true } } },
    );
    await setLocation(1, { id: 1, data: { type: "puck" }, name: "puck" }, 1);

    expect(Item.patch).not.toHaveBeenCalled();
  });
});
