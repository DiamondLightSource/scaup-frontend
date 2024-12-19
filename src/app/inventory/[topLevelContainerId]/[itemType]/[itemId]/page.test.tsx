import { renderWithProviders } from "@/utils/test-utils";
import ItemFormPage from "./page";
import { redirect } from "next/navigation";

const defaultParams = { itemType: "", itemId: "", topLevelContainerId: "1" };

describe("Inventory Item Page", () => {
  it("should redirect if item is top level container and also new", async () => {
    renderWithProviders(
      await ItemFormPage({
        children: <></>,
        params: { ...defaultParams, itemType: "storageDewar", itemId: "new" },
      }),
    );
    expect(redirect).toHaveBeenCalledWith("1");
  });
});
