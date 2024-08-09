import { TreeData } from "@/components/visualisation/treeView";
import { initialState } from "@/features/shipment/shipmentSlice";
import { PositionedItem } from "@/mappings/forms/sample";
import { getCurrentStepIndex } from "@/mappings/pages";
import { renderWithProviders, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { SampleSelector } from "@/components/containers/SampleSelector";
import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";

const defaultUnassigned = structuredClone(initialState.unassigned);

defaultUnassigned[0].children![getCurrentStepIndex("sample")].children!.push(sample);

const selectedSample = {
  ...sample,
  data: { type: "sample", location: 1 },
} as TreeData<PositionedItem>;

describe("Child Sample Selector", () => {
  it("should render all samples that belong to selected sessions", async () => {
    renderWithProviders(<SampleSelector isOpen={true} onClose={() => {}} />, {
      preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
    });

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("sample-in-session");
  });

  it("should render message if selected session has no samples available", async () => {
    server.use(
      http.get(
        "http://localhost/api/proposals/:proposalId/sessions/:visitNumber/samples",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );
    renderWithProviders(<SampleSelector isOpen={true} onClose={() => {}} />, {
      preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
    });

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "cm1234-5" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await screen.findByText("No samples available for this session.");
  });

  it("should render selected item if passed", () => {
    renderWithProviders(
      <SampleSelector
        selectedItem={{ ...sample, data: { type: "sample", location: 1 } }}
        isOpen={true}
        onClose={() => {}}
      />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
    );

    expect(screen.getByText("sample-1")).toBeInTheDocument();
  });

  it("should fire event if item is selected", async () => {
    const itemClickCallback = vi.fn();
    const closeCallback = vi.fn();

    renderWithProviders(
      <SampleSelector isOpen={true} onClose={closeCallback} onSelect={itemClickCallback} />,
      {
        preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
      },
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
      <SampleSelector
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
    renderWithProviders(<SampleSelector isOpen={true} onClose={() => {}} />, {
      preloadedState: { shipment: { ...initialState, unassigned: defaultUnassigned } },
    });

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "inv4l1dname" } });
    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    expect(toastMock).toHaveBeenCalledWith({
      status: "error",
      title: "Invalid proposal reference provided",
    });
  });
});
