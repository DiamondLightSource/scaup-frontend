import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import PrintableOverviewContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };
const data = {
  sample: [{ id: 1, name: "Protein", data: { type: "sample" } }],
  gridBox: [{ id: 1, name: "Box 01", data: { type: "gridBox" } }],
  dewar: [{ id: 1, name: "Dewar", data: { type: "dewar" } }],
} as Record<string, TreeData<BaseShipmentItem>[]>;

describe("Shipment Printable Overview", () => {
  it("should render warning if shipment has unassigned items", () => {
    renderWithProviders(
      <PrintableOverviewContent data={data} params={params} hasUnassigned={true} />,
    );

    expect(screen.getByText(/this shipment contains unassigned items/i)).toBeInTheDocument();
  });

  it("should render type groups", () => {
    renderWithProviders(
      <PrintableOverviewContent data={data} params={params} hasUnassigned={false} />,
    );

    expect(screen.getByText(/grid box/i)).toBeInTheDocument();
    expect(screen.getByText(/sample/i)).toBeInTheDocument();
    expect(screen.getAllByText(/dewar/i)).toHaveLength(2);
  });

  it("should render warning message in body if shipment has no items", () => {
    renderWithProviders(
      <PrintableOverviewContent data={null} params={params} hasUnassigned={false} />,
    );
    expect(screen.getAllByText(/no assigned items/i)).toHaveLength(2);
  });
});
