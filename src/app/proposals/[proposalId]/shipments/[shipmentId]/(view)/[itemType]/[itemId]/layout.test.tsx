import { BaseShipmentItem } from "@/mappings/pages";
import { renderWithProviders } from "@/utils/test-utils";
import { screen } from "@testing-library/react";

import ItemPageLayout from "./layout";

const params = {
  itemType: "puck" as BaseShipmentItem["type"],
  itemId: "9",
  proposalId: "cm00001",
  shipmentId: "1",
};

describe("Item Page Layout", () => {
  it("should render page", async () => {
    renderWithProviders(await ItemPageLayout({ children: <p>Children</p>, params }));
    await screen.findByText("Children");
  });
});
