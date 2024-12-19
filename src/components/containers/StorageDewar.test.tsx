import { getCurrentStepIndex } from "@/mappings/pages";
import { cane, puck, renderAndInjectForm, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { StorageDewar } from "@/components/containers/StorageDewar";

const defaultShipment = { shipment: structuredClone(testInitialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("puck")].children!.push(
  cane,
  puck,
);

describe("Storage Dewar", () => {
  it("should only display canes", async () => {
    renderAndInjectForm(<StorageDewar parentId='1' />, {
      preloadedState: defaultShipment,
    });

    fireEvent.click(screen.getByText("5"));
    expect(screen.getAllByRole("radio")).toHaveLength(1);
  });
});
