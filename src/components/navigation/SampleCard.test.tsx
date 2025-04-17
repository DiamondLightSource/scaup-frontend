import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { SampleCard } from "./SampleCard";

const baseSample = { name: "test-sample", id: 1, type: "grid", proteinId: 1, shipmentId: 1 };
const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Sample Card", () => {
  it("should render sample card", () => {
    renderWithProviders(<SampleCard sample={baseSample} params={params} />);

    expect(screen.getByText("test-sample")).toBeInTheDocument();
    expect(screen.getByText("View Sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
  });

  it("should render 'view data' button if data collection group is available", () => {
    renderWithProviders(
      <SampleCard sample={{ ...baseSample, dataCollectionGroupId: 1 }} params={params} />,
    );

    expect(screen.getByText("test-sample")).toBeInTheDocument();
    expect(screen.getByText("View Data")).toHaveAttribute(
      "href",
      "https://pato.ac.uk/proposals/cm00001/sessions/1/groups/1",
    );
  });

  it("should render message if sample has no parent container", () => {
    renderWithProviders(<SampleCard sample={baseSample} params={params} />);

    expect(screen.getByText("Not assigned to a container")).toBeInTheDocument();
  });

  it("should render link if parent container is provided", async () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, containerName: "parent-gridbox", containerId: 5 }}
        params={params}
      />,
    );

    expect(screen.getByText("parent-gridbox")).toHaveAttribute("href", "/containers/5");
  });

  it("should include slot in container text if sample has location", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, containerName: "parent-gridbox", containerId: 5, location: 10 }}
        params={params}
      />,
    );

    expect(screen.getByText("parent-gridbox")).toBeInTheDocument();
    expect(screen.getByText(/, slot 10/i)).toBeInTheDocument();
  });

  it("should display children", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, derivedSamples: [{ ...baseSample, name: "child-sample" }] }}
        params={params}
      />,
    );

    expect(screen.getByText("Originated")).toBeInTheDocument();
    expect(screen.getByText("child-sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
  });

  it("should display multiple children", () => {
    renderWithProviders(
      <SampleCard
        sample={{
          ...baseSample,
          derivedSamples: [
            { ...baseSample, name: "child-sample" },
            { ...baseSample, name: "child-sample-2", id: 2 },
          ],
        }}
        params={params}
      />,
    );

    expect(screen.getByText("Originated")).toBeInTheDocument();
    expect(screen.getByText("child-sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
    expect(screen.getByText("child-sample-2")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/2/review",
    );
  });

  it("should display parents", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, originSamples: [{ ...baseSample, name: "parent-sample" }] }}
        params={params}
      />,
    );

    expect(screen.getByText("Derived from")).toBeInTheDocument();
    expect(screen.getByText("parent-sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
  });

  it("should display multiple parents", () => {
    renderWithProviders(
      <SampleCard
        sample={{
          ...baseSample,
          originSamples: [
            { ...baseSample, name: "parent-sample" },
            { ...baseSample, name: "parent-sample-2", id: 2 },
          ],
        }}
        params={params}
      />,
    );

    expect(screen.getByText("Derived from")).toBeInTheDocument();
    expect(screen.getByText("parent-sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
    expect(screen.getByText("parent-sample-2")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/2/review",
    );
  });
});
