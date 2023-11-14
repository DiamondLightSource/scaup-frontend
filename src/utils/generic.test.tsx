import { genUniqueId, parseJsonReferences, pascalToSpace } from "./generic";

describe("Unique ID generator", () => {
  it("should generate random ID", () => {
    expect(genUniqueId()).toBeTruthy();
  });
});

describe("Pointer resolver", () => {
  it("should return value if a string is passed instead of a pointer", () => {
    expect(parseJsonReferences("value", {})).toBe("value");
  });

  it("should return null if invalid pointer", () => {
    expect(parseJsonReferences({ $ref: "#/a/b" }, {})).toBe(null);
  });

  it("should find value pointed to by pointer", () => {
    expect(parseJsonReferences({ $ref: "#/a/b" }, { a: { b: "value" } })).toBe("value");
  });

  it("should map out array pointed to by pointer", () => {
    const data = {
      a: {
        b: [
          { c: 1, d: 2, e: 3 },
          { c: 99, d: 2, e: 100 },
        ],
      },
    };
    expect(
      parseJsonReferences({ $ref: { parent: "#/a/b", map: { result: "c", result2: "e" } } }, data),
    ).toEqual([
      { result: 1, result2: 3 },
      { result: 99, result2: 100 },
    ]);
  });
});

describe("Pascal to Space Separated String", () => {
  it("should covert pascal-case to space separated string", () => {
    expect(pascalToSpace("testString")).toBe("Test String");
  });
});
