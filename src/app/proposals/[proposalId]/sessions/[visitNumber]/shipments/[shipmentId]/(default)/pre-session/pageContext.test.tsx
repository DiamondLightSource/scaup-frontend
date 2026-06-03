import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import mockRouter from "next-router-mock";
import { toastMock } from "@/../vitest.setup";
import PreSessionContent from "./pageContent";
import { SessionType } from "@/types/forms";

const params = {
  itemType: "puck" as BaseShipmentItem["type"],
  itemId: "9",
  proposalId: "cm00001",
  shipmentId: "1",
  visitNumber: "1",
};

const preloadedState = {
  shipment: {
    ...testInitialState,
    isReview: true,
  },
};

/**
 * Fill in required fields and press the finish button
 */
const fillInFormAndSubmit = () => {
  fireEvent.change(screen.getByRole("textbox", { name: "Pixel Size (Å)" }), {
    target: { value: "1" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Total Dose (e-/Å)" }), {
    target: { value: "1" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Dose per Frame (e-/Å)" }), {
    target: { value: "1" },
  });
  fireEvent.change(
    screen.getByRole("combobox", {
      name: "Do you need a cross-grating/quantifoil grid for alignments?",
    }),
    {
      target: { value: "No" },
    },
  );
  fireEvent.change(screen.getByRole("combobox", { name: "Use Tomo or EPU?" }), {
    target: { value: "EPU" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Experiment Type" }), {
    target: { value: "Single Particle Analysis" },
  });

  const finishButton = screen.getByText("Finish");

  fireEvent.click(finishButton);
};

describe("Item Page Layout", () => {
  it("should not redirect if shipment submission fails", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/push",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    mockRouter.setCurrentUrl("/");

    renderWithProviders(
      <PreSessionContent shipmentType='TEM' params={params} prepopData={null} />,
      {
        preloadedState,
      },
    );

    fillInFormAndSubmit();

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
    expect(mockRouter.pathname).not.toBe("/pre-session");
  });

  it("should not redirect if pre-session info submission fails", async () => {
    server.use(
      http.put(
        "http://localhost/api/shipments/:shipmentId/preSession",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    mockRouter.setCurrentUrl("/");

    renderWithProviders(
      <PreSessionContent shipmentType='TEM' params={params} prepopData={null} />,
      {
        preloadedState,
      },
    );

    fillInFormAndSubmit();

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
    expect(mockRouter.pathname).not.toBe("/pre-session");
  });

  it("should redirect if push is successful", async () => {
    mockRouter.setCurrentUrl("/");

    renderWithProviders(
      <PreSessionContent shipmentType='TEM' params={params} prepopData={null} />,
      {
        preloadedState: {
          shipment: {
            ...testInitialState,
            isReview: true,
          },
        },
      },
    );

    fillInFormAndSubmit();

    await waitFor(() => expect(mockRouter.pathname).toBe("/submitted"));
  });

  it("should populate form with existing pre-session data, if available", () => {
    mockRouter.setCurrentUrl("/");

    renderWithProviders(
      <PreSessionContent shipmentType='TEM' params={params} prepopData={{ pixelSize: 250 }} />,
      {
        preloadedState,
      },
    );

    expect(screen.getByDisplayValue("250")).toBeInTheDocument();
  });

  it.each([
    { field: "Post-milling fluorescence imaging", type: "Aquilos" },
    { field: "Fluorescence map (2D correlation)", type: "CLEM" },
    { field: "Imaging Conditions", type: "TEM" },
  ])("should display $field if shipment type is $type", ({ field, type }) => {
    mockRouter.setCurrentUrl("/");

    renderWithProviders(
      <PreSessionContent shipmentType={type as SessionType} params={params} prepopData={{}} />,
      {
        preloadedState,
      },
    );

    expect(screen.getByText(field)).toBeInTheDocument();
  });

  it("should ignore push if skipPush is set", async () => {
    server.use(
      http.post(
        "http://localhost/api/shipments/:shipmentId/push",
        () => HttpResponse.json({}, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(
      <PreSessionContent
        shipmentType='TEM'
        params={params}
        prepopData={{ pixelSize: 250 }}
        skipPush={true}
      />,
      {
        preloadedState,
      },
    );

    fillInFormAndSubmit();

    await waitFor(() => expect(mockRouter.pathname).toBe("/submitted"));
  });
});
