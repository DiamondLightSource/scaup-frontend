import { toastMock } from "@/../vitest.setup";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ImportSamplesPageContent from "./pageContent";

const params = { proposalId: "cm00001", shipmentId: "1", visitNumber: "1" };

describe("Import Samples Page Content", () => {
  it("should disable continue button if no samples are selected", () => {
    renderWithProviders(
      <ImportSamplesPageContent/>,
    );
  });

  it("should render forms for selected samples", () => {
    renderWithProviders(
      <ImportSamplesPageContent/>,
    );
  });

  it("should display message if no samples are available", () => {
    renderWithProviders(
      <ImportSamplesPageContent/>,
    );
  });
});
