import { BaseShipmentItem } from "@/mappings/pages";
import { gridBox, renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import PrintableOverviewContent, { PrintButton } from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1" };
const defaultShipment = {
  name: "Shipment",
  id: 1,
  data: { type: "shipment" as BaseShipmentItem["type"] },
  children: [
    {
      id: "dewar",
      name: "dewar",
      data: { type: "dewar" },
      children: [
        {
          id: "container",
          name: "container",
          data: { type: "puck", registeredContainer: 1 },
          children: [gridBox],
        },
      ],
    },
  ],
};

describe("Shipment Printable Overview", () => {
  it("should position if item has position", () => {
    renderWithProviders(<PrintableOverviewContent shipment={defaultShipment} prepopData={{}} />);

    expect(screen.getByText("In container, position 5")).toBeInTheDocument();
  });

  it("should render parent name if item has parent", () => {
    renderWithProviders(<PrintableOverviewContent shipment={defaultShipment} prepopData={{}} />);

    expect(screen.getByText(/in container/i)).toBeInTheDocument();
    expect(screen.getByText("In dewar")).toBeInTheDocument();
  });

  it("should display 'human' value of field if field is prepopulated with external data", () => {
    renderWithProviders(
      <PrintableOverviewContent
        shipment={defaultShipment}
        prepopData={{ containers: [{ containerRegistryId: 1, barcode: "barcode value" }] }}
      />,
    );

    expect(screen.getByText("barcode value")).toBeInTheDocument();
  });
});

describe("Print Button", () => {
  it("should print if print button clicked", () => {
    const printSpy = vi.spyOn(window, "print");
    renderWithProviders(<PrintButton />);

    fireEvent.click(screen.getByText(/print this page/i));
    expect(printSpy).toBeCalled();
  });
});
