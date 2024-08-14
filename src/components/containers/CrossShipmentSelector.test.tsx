import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { getCurrentStepIndex } from "@/mappings/pages";
import { gridBox, puck, renderWithProviders, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { CrossShipmentSelector } from "@/components/containers/CrossShipmentSelector";
import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";

const defaultUnassigned = structuredClone(initialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("puck")].children!.push(puck);

const selectedSample = {
  ...sample,
  data: { type: "sample", location: 1 },
} as TreeData<PositionedItem>;

describe("Cross Shipment Child Selector", () => {
  it("should render all samples that belong to selected sessions", async () => {
    renderWithProviders(
      <CrossShipmentSelector childrenType='sample' isOpen={true} onClose={() => {}} />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("sample-in-session");
  });

  it("should reset selected items list if item is selected", async () => {
    const { rerender } = renderWithProviders(
      <CrossShipmentSelector childrenType='sample' isOpen={true} onClose={() => {}} />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));
    fireEvent.click(await screen.findByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    rerender(<CrossShipmentSelector childrenType='sample' isOpen={true} onClose={() => {}} />);

    expect(screen.queryByText("sample-in-session")).not.toBeInTheDocument();
  });

  it("should render unassigned items by default", async () => {
    renderWithProviders(
      <CrossShipmentSelector childrenType='puck' isOpen={true} onClose={() => {}} />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
    );

    expect(screen.getByText("puck")).toBeInTheDocument();
  });

  it("should render message if selected session has no samples available", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalId/sessions/:visitNumber/samples",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(
      <CrossShipmentSelector childrenType='sample' isOpen={true} onClose={() => {}} />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("No samples available for this session.");
  });

  it("should render selected item if passed", () => {
    renderWithProviders(
      <CrossShipmentSelector
        childrenType='sample'
        selectedItem={{ ...sample, data: { type: "sample", location: 1 } }}
        isOpen={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("sample-1")).toBeInTheDocument();
  });

  it("should fire event if item is selected", async () => {
    const itemClickCallback = vi.fn();
    const closeCallback = vi.fn();

    renderWithProviders(
      <CrossShipmentSelector
        childrenType='sample'
        isOpen={true}
        onClose={closeCallback}
        onSelect={itemClickCallback}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));
    fireEvent.click(await screen.findByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(itemClickCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "sample-in-session",
      }),
    );

    await waitFor(() => expect(closeCallback).toHaveBeenCalled());
  });

  it("should fire event if item is removed", async () => {
    const itemRemoveCallback = vi.fn();

    renderWithProviders(
      <CrossShipmentSelector
        childrenType='sample'
        selectedItem={selectedSample}
        isOpen={true}
        onClose={() => {}}
        onRemove={itemRemoveCallback}
      />,
    );

    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(itemRemoveCallback).toHaveBeenCalledWith(selectedSample));
  });

  it("should display toast if invalid proposal reference is provided", () => {
    renderWithProviders(
      <CrossShipmentSelector childrenType='sample' isOpen={true} onClose={() => {}} />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "inv4l1dname" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    expect(toastMock).toHaveBeenCalledWith({
      status: "error",
      title: "Invalid proposal reference provided",
    });
  });

  it("should apply further type filter if child is container", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalId/sessions/:visitNumber/containers",
        ({ request }) => {
          if (new URL(request.url).searchParams.get("type") === "gridBox") {
            return HttpResponse.json(
              { items: [{ ...gridBox, name: "filtered-gridbox" }] },
              { status: 200 },
            );
          }
          return HttpResponse.json({}, { status: 404 });
        },
        { once: true },
      ),
    );

    renderWithProviders(
      <CrossShipmentSelector
        childrenType='gridBox'
        selectedItem={selectedSample}
        isOpen={true}
        onClose={() => {}}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("filtered-gridbox");
  });
});
