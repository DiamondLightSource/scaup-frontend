import { renderAndInjectForm } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { AquilosShuttle } from "@/components/containers/AquilosShuttle";
import { components } from "@/types/schema";

const defaultSample: components["schemas"]["SampleOut"] = {
  id: 1,
  name: "aquilos-sample",
  subLocation: 0,
  type: "sample",
  shipmentId: 1,
  proteinId: 1,
  details: {
    concentration: 1,
  },
};

describe("Aquilos Shuttle", () => {
  it("should render 2 shuttle slots", () => {
    renderAndInjectForm(<AquilosShuttle samples={[]} />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should render passed samples", () => {
    renderAndInjectForm(<AquilosShuttle samples={[defaultSample]} />);

    expect(screen.getByText("aquilos-sample")).toBeInTheDocument();
  });

  it("should render selectable samples in modal", () => {
    renderAndInjectForm(<AquilosShuttle samples={[{ ...defaultSample, subLocation: null }]} />);

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText("aquilos-sample")).toBeInTheDocument();
  });

  it("should close modal when adding sample", async () => {
    renderAndInjectForm(<AquilosShuttle samples={[{ ...defaultSample, subLocation: null }]} />);

    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText("aquilos-sample")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());
  });

  it("should close modal when removing sample", async () => {
    renderAndInjectForm(<AquilosShuttle samples={[defaultSample]} />);

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => expect(screen.queryByText("Apply")).not.toBeInTheDocument());
  });
});
