import { server } from "@/mocks/server";
import { renderWithProviders, wrapInPromise } from "@/utils/test-utils";
import { HttpResponse, http } from "msw";
import ShipmentsLayout from "@/app/proposals/[proposalId]/sessions/[visitNumber]/shipments/[shipmentId]/(view)/layout";
import { redirect } from "next/navigation";

const params = wrapInPromise({ shipmentId: "1", proposalId: "1", visitNumber: "1" });

describe("Sample Collection Layout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render child content", async () => {
    renderWithProviders(await ShipmentsLayout({ children: <></>, params }));
  });
});
