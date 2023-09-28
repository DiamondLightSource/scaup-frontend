import { getCurrentStepIndex, separateDetails } from "@/mappings/pages";
describe("Stepper", () => {
  it("should find step index if step has array of type IDs", () => {
    expect(getCurrentStepIndex("puck")).toBe(2);
  });

  it("should find step index if step has single type ID", () => {
    expect(getCurrentStepIndex("dewar")).toBe(3);
  });
});

describe("Detail Separator", () => {
  it("should overwrite details in resulting object if they already exist", () => {
    const output = separateDetails(
      { details: { a: "b", c: "d" }, parentId: 1, a: "z" },
      "containers",
    );

    expect(output.details).toEqual({ a: "z", c: "d" });
  });

  it("should not include container root keys in details", () => {
    const output = separateDetails({ parentId: 1, topLevelContainerId: 3, a: "z" }, "containers");
    expect(output.details).toEqual({ a: "z" });
    expect(output).toMatchObject({ parentId: 1, topLevelContainerId: 3 });
  });

  it("should not include sample root keys in details", () => {
    const output = separateDetails({ proteinId: 3, a: "z" }, "samples");
    expect(output.details).toEqual({ a: "z" });
    expect(output).toMatchObject({ proteinId: 3 });
  });

  it("should not include top level container root keys in details", () => {
    const output = separateDetails({ barCode: 3, code: 1, a: "z" }, "topLevelContainers");
    expect(output.details).toEqual({ a: "z" });
    expect(output).toMatchObject({ barCode: 3, code: 1 });
  });
  it("should not include shipment root keys in details", () => {
    const output = separateDetails({ proposalReference: "cm00001", a: "z" }, "shipments");
    expect(output.details).toEqual({ a: "z" });
    expect(output).toMatchObject({ proposalReference: "cm00001" });
  });
});
