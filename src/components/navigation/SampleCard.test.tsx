import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { ItemStepper } from "./ItemStepper";
import { SampleCard } from "./SampleCard";

const baseSample = { name: "test-sample", id: 1, type: "grid", proteinId: 1, shipmentId: 1 };

describe("Sample Card", () => {
  it("should render sample card", () => {
    renderWithProviders(<SampleCard sample={baseSample} />);

    expect(screen.getByText("test-sample")).toBeInTheDocument();
  });

  it("should render message if sample has no parent container", () => {
    renderWithProviders(<SampleCard sample={baseSample} />);

    expect(screen.getByText("Not assigned to a container")).toBeInTheDocument();
  });

  it("should render link if parent container is provided", () => {
    renderWithProviders(
      <SampleCard sample={{ ...baseSample, parent: "parent-gridbox", containerId: 5 }} />,
    );

    expect(screen.getByText("In parent-gridbox")).toBeInTheDocument();
  });

  it("should include slot in container text if sample has location", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, parent: "parent-gridbox", containerId: 5, location: 10 }}
      />,
    );

    expect(screen.getByText("In parent-gridbox, slot 10")).toBeInTheDocument();
  });
});
