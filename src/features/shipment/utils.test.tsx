import { getCurrentStepIndex } from "@/mappings/pages";
import "@testing-library/jest-dom";
import { defaultUnassigned } from "./shipmentSlice";
import { addToUnassignedClone, setInUnassignedClone } from "./utils";

describe("Shipment Store Slice Utils", () => {
  it("should add item to clone of unassigned", () => {
    const newUnassigned = addToUnassignedClone(structuredClone(defaultUnassigned), {
      id: 1,
      data: { type: "puck" },
      name: "Puck",
    });

    expect(newUnassigned[0].children![getCurrentStepIndex("puck")].children).toHaveLength(1);
  });

  it("should set list of unassigned items of passed type to passed array", () => {
    const newUnassigned = structuredClone(defaultUnassigned);

    setInUnassignedClone(
      newUnassigned,
      [
        {
          id: 1,
          data: { type: "puck" },
          name: "Puck",
        },
        {
          id: 2,
          data: { type: "puck" },
          name: "Puck 2",
        },
      ],
      "container",
    );

    expect(newUnassigned[0].children![getCurrentStepIndex("puck")].children).toHaveLength(2);
  });

  it("should raise exception when invalid type is provided", () => {
    const newUnassigned = structuredClone(defaultUnassigned);

    expect(() => setInUnassignedClone(newUnassigned, [], "invalidType")).toThrow(Error);
  });
});
