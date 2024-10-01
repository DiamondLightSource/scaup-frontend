import { BaseShipmentItem } from "@/mappings/pages";
import { gridBox, prepopData, renderWithProviders, sample } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import PrintableOverviewContent, { PrintButton } from "./pageContent";

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
          data: { type: "puck", registeredContainer: "DLS-01" },
          children: [{ ...gridBox, children: [sample] }],
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
      <PrintableOverviewContent shipment={defaultShipment} prepopData={prepopData} />,
    );

    expect(screen.getByText("AAA")).toBeInTheDocument();
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
