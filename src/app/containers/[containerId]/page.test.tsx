import { defaultData } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { baseShipmentParams, renderWithProviders, wrapInPromise } from "@/utils/test-utils";
import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import mockRouter from "next-router-mock";
import ContainerRedirect from "./page";
import { redirect } from "next/navigation";

const params = { params: wrapInPromise({ containerId: 1 }) };

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, redirect: vi.fn() };
});

describe("Container Redirect", () => {
  it("should redirect to container in shipment", async () => {
    renderWithProviders(await ContainerRedirect(params));

    expect(redirect).toBeCalledWith("/proposals/cm123/sessions/1/shipments/1/gridBox/1/review");
  });

  it("should redirect to inventory if container is internal", async () => {
    server.use(
      http.get(
        "http://localhost/api/containers/:containerId",
        () =>
          HttpResponse.json({
            internalStorageContainer: 123,
            id: 25,
            type: "gridBox",
            isInternal: true,
          }),
        { once: true },
      ),
    );

    renderWithProviders(await ContainerRedirect(params));

    expect(redirect).toBeCalledWith("/inventory/123/gridBox/25");
  });

  it("should display error if container request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/containers/:containerId",
        () => HttpResponse.json({ detail: "Container not found" }, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ContainerRedirect(params));

    expect(screen.getByText("Container not found")).toBeInTheDocument();
  });

  it("should display error if shipment request returns error", async () => {
    server.use(
      http.get(
        "http://localhost/api/shipments/:shipmentId",
        () => HttpResponse.json({ detail: "Shipment not found" }, { status: 404 }),
        { once: true },
      ),
    );

    renderWithProviders(await ContainerRedirect(params));

    expect(screen.getByText("Shipment not found")).toBeInTheDocument();
  });
});
