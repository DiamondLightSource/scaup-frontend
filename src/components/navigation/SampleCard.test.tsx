import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { ItemStepper } from "./ItemStepper";
import { SampleCard } from "./SampleCard";
import mockRouter from "next-router-mock";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { toastMock } from "../../../vitest.setup";

const baseSample = { name: "test-sample", id: 1, type: "grid", proteinId: 1, shipmentId: 1 };
const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Sample Card", () => {
  it("should render sample card", () => {
    renderWithProviders(<SampleCard sample={baseSample} params={params} patoUrl='' />);

    expect(screen.getByText("test-sample")).toBeInTheDocument();
    expect(screen.getByText("View Sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
  });

  it("should render 'view data' button if data collection group is available", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, dataCollectionGroupId: 1 }}
        params={params}
        patoUrl=''
      />,
    );

    expect(screen.getByText("test-sample")).toBeInTheDocument();
    expect(screen.getByText("View Data")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/groups/1",
    );
  });

  it("should render message if sample has no parent container", () => {
    renderWithProviders(<SampleCard sample={baseSample} params={params} patoUrl='' />);

    expect(screen.getByText("Not assigned to a container")).toBeInTheDocument();
  });

  it("should render link if parent container is provided", async () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, container: "parent-gridbox", containerId: 5 }}
        params={params}
        patoUrl=''
      />,
    );

    fireEvent.click(screen.getByText("parent-gridbox"));

    await waitFor(() =>
      expect(mockRouter.pathname).toBe(
        "/proposals/cm00001/sessions/1/shipments/1/gridBox/1/review",
      ),
    );
  });

  it("should include slot in container text if sample has location", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, container: "parent-gridbox", containerId: 5, location: 10 }}
        params={params}
        patoUrl=''
      />,
    );

    expect(screen.getByText("parent-gridbox")).toBeInTheDocument();
    expect(screen.getByText(/, slot 10/i)).toBeInTheDocument();
  });

  it("should display children", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, children: [{ ...baseSample, name: "child-sample" }] }}
        params={params}
        patoUrl=''
      />,
    );

    expect(screen.getByText("Originated")).toBeInTheDocument();
    expect(screen.getByText("child-sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
  });

  it("should display parents", () => {
    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, parents: [{ ...baseSample, name: "child-sample" }] }}
        params={params}
        patoUrl=''
      />,
    );

    expect(screen.getByText("Derived from")).toBeInTheDocument();
    expect(screen.getByText("child-sample")).toHaveAttribute(
      "href",
      "/proposals/cm00001/sessions/1/shipments/1/grid/1/review",
    );
  });

  it("should display toast if container link is clicked and error is returned", async () => {
    server.use(
      http.get(
        "http://localhost/api/containers/:containerId",
        () => HttpResponse.json({ detail: "Some Error Here" }, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(
      <SampleCard
        sample={{ ...baseSample, container: "parent-gridbox", containerId: 5 }}
        params={params}
        patoUrl=''
      />,
    );

    fireEvent.click(screen.getByText("parent-gridbox"));
    await waitFor(() =>
      expect(toastMock).toBeCalledWith({
        description: "Some Error Here",
        status: "error",
        title: "Failed to get sample data",
      }),
    );
  });
});
