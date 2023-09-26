import ShipmentOverview from "@/components/visualisation/shipmentOverview";
import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { BaseShipmentItem } from "@/mappings/pages";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

const defaultShipment = [
  {
    id: "dewar",
    name: "dewar",
    data: { type: "dewar" },
    children: [{ id: "container", name: "container", data: { type: "puck" } }],
  },
] satisfies TreeData<BaseShipmentItem>[];

const defaultUnassigned = [
  {
    name: "Unassigned",
    isNotViewable: true,
    id: "root",
    data: {},
    children: [
      {
        name: "Samples",
        id: "sample",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
      {
        name: "Grid Boxes",
        id: "gridBox",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [],
      },
      {
        name: "Containers",
        id: "container",
        isUndeletable: true,
        isNotViewable: true,
        data: {},
        children: [defaultShipment[0].children[0]],
      },
    ],
  },
];

describe("Shipment Overview", () => {
  it("should render tree", () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' onActiveChanged={() => {}} proposal='' />,
      {
        preloadedState: { shipment: { ...initialState, items: defaultShipment } },
      },
    );

    const dewarAccordion = screen.getByText("dewar");
    expect(dewarAccordion).toBeInTheDocument();

    fireEvent.click(dewarAccordion);

    expect(screen.getByText("container")).toBeInTheDocument();
  });

  it("should move non-root item to unassigned when remove is clicked", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            containers: [defaultShipment[0].children[0]],
          }),
        ),
      ),
      rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            children: [{ ...defaultShipment[0], children: [] }],
          }),
        ),
      ),
    );

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: { shipment: { ...initialState, items: defaultShipment } },
      },
    );

    fireEvent.click(screen.getByText("dewar"));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    fireEvent.click(screen.getByText(/unassigned/i));
    fireEvent.click(screen.getByText(/containers/i));

    expect(screen.getByText("container")).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText("Remove")).toHaveLength(2));
  });

  it("should remove root item completely when remove is clicked", async () => {
    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...initialState, items: [{ ...defaultShipment[0], children: [] }] },
        },
      },
    );

    await screen.findByText("dewar");

    fireEvent.click(screen.getAllByRole("button", { name: /remove/i })[0]);

    await waitFor(() => expect(screen.queryByText("dewar")).not.toBeInTheDocument());
  });

  it("should remove item from unassigned when clicked", async () => {
    server.use(
      rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            containers: [],
          }),
        ),
      ),
    );

    renderWithProviders(
      <ShipmentOverview shipmentId='1' proposal='' onActiveChanged={() => {}} />,
      {
        preloadedState: {
          shipment: { ...initialState, unassigned: defaultUnassigned },
        },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    await waitFor(() => expect(screen.queryByText(/remove/i)).not.toBeInTheDocument());
  });
});
