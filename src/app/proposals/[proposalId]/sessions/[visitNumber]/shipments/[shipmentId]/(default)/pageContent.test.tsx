import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import ShipmentHomeContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Sample Collection Submission Overview", () => {
  it("should render sample collection samples", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [
            {
              name: "C01",
              id: 1,
              location: 1,
              shipmentId: 1,
              proteinId: 1,
              containerId: 1,
              type: "sample",
            },
          ],
          counts: {},
          dispatch: {},
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        patoUrl="https://pato.ac.uk"
      />,
    );

    expect(screen.getByText("C01")).toBeInTheDocument();
  });

  it("should direct user to sample page if sample clicked", async () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [
            {
              name: "C01",
              id: 1,
              location: 1,
              shipmentId: 1,
              proteinId: 1,
              containerId: 1,
              type: "sample",
            },
          ],
          counts: {},
          dispatch: {},
          name: "",
          preSessionInfo: null,
          hasUnassigned: false,
        }}
        patoUrl="https://pato.ac.uk"
      />,
    );

    fireEvent.click(screen.getByText("C01"));

    await waitFor(() => expect(mockRouter.pathname).toBe("/1/sample/1/review"));
  });

  it("should display link to data collection group if available", () => {
    renderWithProviders(
      <ShipmentHomeContent
        params={params}
        data={{
          samples: [
            {
              id: 1,
              name: "sample-test",
              type: "grid",
              shipmentId: 1,
              proteinId: 1,
              dataCollectionGroupId: 1,
            },
          ],
          counts: {},
          dispatch: { status: "Booked" },
          name: "",
          preSessionInfo: { details: { pixelSize: 150 } },
          hasUnassigned: true,
        }}
        patoUrl="https://pato.ac.uk"
      />,
    );

    expect(screen.getByText("View Data")).toBeInTheDocument();
  });
});
