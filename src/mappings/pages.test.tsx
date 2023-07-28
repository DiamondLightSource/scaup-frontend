import { getCurrentStepIndex } from "@/mappings/pages";
import "@testing-library/jest-dom";

describe("Stepper", () => {
  it("should find step index if step has array of type IDs", () => {
    expect(getCurrentStepIndex("puck")).toBe(2);
  });

  it("should find step index if step has single type ID", () => {
    expect(getCurrentStepIndex("dewar")).toBe(3);
  });
});
