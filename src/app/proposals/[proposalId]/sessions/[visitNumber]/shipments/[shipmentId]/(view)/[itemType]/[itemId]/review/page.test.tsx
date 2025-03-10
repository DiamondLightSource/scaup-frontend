import { renderWithProviders, wrapInPromise } from "@/utils/test-utils";
import ReviewPage from "./page";

const params = wrapInPromise({ shipmentId: "1", proposalId: "1" });

describe("Review Page", () => {
  it("should render page", async () => {
    renderWithProviders(await ReviewPage({ params }));
  });
});
