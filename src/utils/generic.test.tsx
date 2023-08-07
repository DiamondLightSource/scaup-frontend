import "@testing-library/jest-dom";
import { genUniqueId } from "./generic";

describe("Generic Utility Functions", () => {
  it("should generate random ID", () => {
    expect(genUniqueId()).toBeTruthy();
  });
});
