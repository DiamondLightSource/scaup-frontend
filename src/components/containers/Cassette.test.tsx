import { renderAndInjectForm, sample } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Cassette } from "@/components/containers/Cassette";

const defaultSample = {
  id: 1,
  name: "cassette-sample",
  subLocation: 1,
  type: "sample",
  shipmentId: 1,
  proteinId: 1,
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
    fireEvent.click(screen.getByText(/apply/i));

    await waitFor(() => expect(screen.queryByText(/apply/i)).not.toBeInTheDocument());
  });

  it("should close modal when removing sample from cassette", async () => {
    renderAndInjectForm(<Cassette samples={[defaultSample]} />);

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => expect(screen.queryByText(/apply/i)).not.toBeInTheDocument());
  });
});
