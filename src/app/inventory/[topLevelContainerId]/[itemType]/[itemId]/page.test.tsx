import { renderWithProviders, wrapInPromise } from "@/utils/test-utils";
import ItemFormPage from "./page";
import { redirect } from "next/navigation";

const defaultParams = wrapInPromise({
  topLevelContainerId: "1",
  itemType: "storageDewar",
  itemId: "new",
});

describe("Inventory Item Page", () => {
  it("should redirect if item is top level container and also new", async () => {
    renderWithProviders(
      await ItemFormPage({
        children: <></>,
        params: defaultParams,
      }),
    );
    expect(redirect).toHaveBeenCalledWith("1");
  });
});
