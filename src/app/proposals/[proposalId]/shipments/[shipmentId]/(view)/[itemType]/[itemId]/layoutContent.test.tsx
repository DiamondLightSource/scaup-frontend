import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { puck, renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";

import { toastMock } from "@/../vitest.setup";
import ItemPageLayoutContent from "./layoutContent";

const defaultShipmentItems: TreeData[] = [
  {
    id: "",
    name: "",
    data: { type: "dewar" },
    children: [puck],
  },
];

const params = {
  itemType: "puck" as BaseShipmentItem["type"],
  itemId: "9",
  proposalId: "cm00001",
  shipmentId: "1",
};

describe("Item Page Layout Content", () => {
  it("should set item in path as active item if it exists", () => {
    const { store } = renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
      { preloadedState: { shipment: { ...testInitialState, items: defaultShipmentItems } } },
    );

    expect(store.getState()).toMatchObject({
      shipment: { activeItem: { id: 9, data: { type: "puck" } } },
    });
  });

  it("should set active item to blank new item if item id is 'new'", () => {
    const { store } = renderWithProviders(
      <ItemPageLayoutContent params={{ ...params, itemId: "new" }}>
        <></>
      </ItemPageLayoutContent>,
      { preloadedState: { shipment: { ...testInitialState, items: defaultShipmentItems } } },
    );

    expect(store.getState()).toMatchObject({
      shipment: { activeItem: { id: "new-puck", data: { type: "puck" } }, isEdit: false },
    });
  });

  it("should not let user click finish if there are unassigned items", () => {
    const newUnassigned = structuredClone(testInitialState.unassigned);

    newUnassigned[0].children![2].children = [puck];
    renderWithProviders(
      <ItemPageLayoutContent params={{ ...params, itemType: "dewar" }}>
        <></>
      </ItemPageLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            unassigned: newUnassigned,
          },
        },
      },
    );

    expect(
      screen.getByText("Cannot progress without assigning all items to a container!"),
    ).toBeInTheDocument();
  });

  it("should move to next step if continue clicked", async () => {
    renderWithProviders(
      <ItemPageLayoutContent params={{ ...params, itemType: "sample" }}>
        <></>
      </ItemPageLayoutContent>,
    );

    const editButton = screen.getByRole("button", {
      name: /continue/i,
    });

    fireEvent.click(editButton);

    expect(mockRouter.pathname).toBe("/gridBox/new/edit");
  });

  it("should enter edit mode if edit clicked in review page", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            isReview: true,
          },
        },
      },
    );

    const editButton = screen.getByRole("link", {
      name: /edit/i,
    });

    fireEvent.click(editButton);

    expect(mockRouter.pathname).toBe("/gridBox/new/edit");
  });

  it("should display 'continue' button in overview on all steps but last", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
    );

    const continueButton = screen.getByRole("button", {
      name: /continue/i,
    });

    expect(continueButton).toBeInTheDocument();
  });

  it("should redirect user to review page if finish is clicked", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={{ ...params, itemType: "dewar" }}>
        <></>
      </ItemPageLayoutContent>,
    );

    const finishButton = screen.getByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

    expect(mockRouter.pathname).toBe("/review");
  });

  it("should redirect user to successful submission page after submitting", async () => {
    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            isReview: true,
          },
        },
      },
    );

    const finishButton = await waitFor(() =>
      screen.findByRole("button", {
        name: /finish/i,
      }),
    );

    fireEvent.click(finishButton);

    await waitFor(() => expect(mockRouter.pathname).toBe("/submitted"));
  });

  it("should not redirect if shipment submission fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/push",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    mockRouter.setCurrentUrl("/");

    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            isReview: true,
          },
        },
      },
    );

    const finishButton = await waitFor(() =>
      screen.findByRole("button", {
        name: /finish/i,
      }),
    );

    fireEvent.click(finishButton);

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
    expect(mockRouter.pathname).not.toBe("/submitted");
  });

  it("should display 'finish' button in overview on last step", async () => {
    renderWithProviders(
      <ItemPageLayoutContent params={{ ...params, itemType: "dewar" }}>
        <></>
      </ItemPageLayoutContent>,
    );

    const finishButton = await screen.findByRole("button", {
      name: /finish/i,
    });

    expect(finishButton).toBeInTheDocument();
  });

  it("should navigate to corresponding step when step is clicked", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
    );

    fireEvent.click(screen.getByLabelText("Grid Boxes Step"));

    expect(mockRouter.pathname).toBe("/gridBox/new/edit");
  });

  it("should navigate to first subtype if current step type is overloaded with array of subtypes", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
    );

    fireEvent.click(screen.getByLabelText("Containers Step"));

    expect(mockRouter.pathname).toBe("/puck/new/edit");
  });

  it("should render steps", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={params}>
        <></>
      </ItemPageLayoutContent>,
    );

    expect(screen.getByLabelText("Samples Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Grid Boxes Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Containers Step")).toBeInTheDocument();
    expect(screen.getByLabelText("Dewars Step")).toBeInTheDocument();
  });

  it("should match current step to current path", () => {
    renderWithProviders(
      <ItemPageLayoutContent params={{ ...params, itemType: "dewar" }}>
        <></>
      </ItemPageLayoutContent>,
    );

    const stepHeading = screen.getAllByRole("heading", {
      name: /dewars/i,
    });

    expect(stepHeading[0]).toHaveAttribute("data-status", "active");
  });
});
