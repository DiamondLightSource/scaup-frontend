import { renderAndInjectForm } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Cassette } from "@/components/containers/Cassette";
import { components } from "@/types/schema";

const defaultSample: components["schemas"]["SampleOut"] = {
  id: 1,
  name: "cassette-sample",
  subLocation: 1,
  type: "sample",
  shipmentId: 1,
  proteinId: 1,
  details: {
    concentration: 1
  }
};

describe("Cassette", () => {
  it("should render 12 cassette slots", () => {
    renderAndInjectForm(<Cassette samples={[]} />);

    expect(screen.getAllByRole("button")).toHaveLength(12);
  });

  it("should render passed samples", () => {
    renderAndInjectForm(<Cassette samples={[defaultSample]} />);

    expect(screen.getByText("cassette-sample")).toBeInTheDocument();
  });

  it("should render selectable samples in modal", () => {
    renderAndInjectForm(<Cassette samples={[{ ...defaultSample, subLocation: null }]} />);

    fireEvent.click(screen.getByText("12"));

    expect(screen.getByText("cassette-sample")).toBeInTheDocument();
  });

  it("should close modal when adding sample to cassette", async () => {
    renderAndInjectForm(<Cassette samples={[{ ...defaultSample, subLocation: null }]} />);

    fireEvent.click(screen.getByText("12"));

    expect(screen.getByText("cassette-sample")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());
  });

  it("should close modal when removing sample from cassette", async () => {
    renderAndInjectForm(<Cassette samples={[defaultSample]} />);

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());
  });
});
