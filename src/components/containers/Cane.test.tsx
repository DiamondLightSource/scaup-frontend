import { Cane } from "@/components/containers/Cane";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, getCurrentStepIndex } from "@/mappings/pages";
import { puck, renderAndInjectForm, testInitialState } from "@/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";

const defaultShipment = { shipment: structuredClone(testInitialState) };

defaultShipment.shipment.unassigned[0].children![getCurrentStepIndex("puck")].children!.push(puck);

const populatedContainer = {
  name: "cane",
  id: 1,
  data: { type: "cane" },
  children: [{ ...puck, data: { location: 5 } }],
} as TreeData<BaseShipmentItem>;

defaultShipment.shipment.activeItem = populatedContainer;

describe("Cane", () => {
  it("should not include canes as children of other canes", async () => {
    const unassignedPuckShipment = structuredClone(defaultShipment);
    unassignedPuckShipment.shipment.unassigned[0].children![1].children = [populatedContainer];

    renderAndInjectForm(<Cane parentId='1' />, {
      preloadedState: unassignedPuckShipment,
    });

    fireEvent.click(screen.getByText("5"));
    expect(screen.getAllByRole("radio")).toHaveLength(1);
  });
});
