import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import mockRouter from "next-router-mock";
import { toastMock } from "@/../vitest.setup";
import PreSessionContent from "./pageContent";

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

    renderWithProviders(<PreSessionContent params={params} prepopData={null} />, {
      preloadedState,
    });

    const finishButton = await screen.findByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

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

    renderWithProviders(<PreSessionContent params={params} prepopData={null} />, {
      preloadedState,
    });

    const finishButton = await screen.findByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
    expect(mockRouter.pathname).not.toBe("/pre-session");
  });

  it("should redirect if push is successful", async () => {
    mockRouter.setCurrentUrl("/");

    renderWithProviders(<PreSessionContent params={params} prepopData={null} />, {
      preloadedState: {
        shipment: {
          ...testInitialState,
          isReview: true,
        },
      },
    });

    const finishButton = await screen.findByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

    await waitFor(() => expect(mockRouter.pathname).toBe("/submitted"));
  });

  it("should populate form with existing pre-session data, if available", () => {
    mockRouter.setCurrentUrl("/");

    renderWithProviders(<PreSessionContent params={params} prepopData={{ pixelSize: 250 }} />, {
      preloadedState,
    });

    expect(screen.getByDisplayValue("250")).toBeInTheDocument();
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
      <PreSessionContent params={params} prepopData={{ pixelSize: 250 }} skipPush={true} />,
      {
        preloadedState,
      },
    );

    const finishButton = await screen.findByRole("button", {
      name: /finish/i,
    });

    fireEvent.click(finishButton);

    await waitFor(() => expect(mockRouter.pathname).toBe("/submitted"));
  });
});
