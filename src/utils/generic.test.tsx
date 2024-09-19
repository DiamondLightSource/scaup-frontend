import { calcCircumferencePos, genUniqueId, parseJsonReferences, pascalToSpace } from "./generic";

describe("Unique ID generator", () => {
  it("should generate random ID", () => {
    expect(genUniqueId()).toBeTruthy();
  });
});

const data = {
  a: {
    b: [
      { c: 1, d: 2, e: 3 },
      { c: 99, d: 2, e: 100 },
    ],
  },
};

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
    expect(
      parseJsonReferences({ $ref: { parent: "#/a/b", map: { result: "c", result2: "e" } } }, data),
    ).toEqual([
      { result: 1, result2: 3 },
      { result: 99, result2: 100 },
    ]);
  });

  it("should map out array pointed to by pointer and include base values", () => {
    expect(
      parseJsonReferences(
        {
          base: [{ result1: 5, result2: 5 }],
          $ref: { parent: "#/a/b", map: { result: "c", result2: "e" } },
        },
        data,
      ),
    ).toEqual([
      { result1: 5, result2: 5 },
      { result: 1, result2: 3 },
      { result: 99, result2: 100 },
    ]);
  });

  it("should return null if reference points to empty array", () => {
    expect(
      parseJsonReferences(
        {
          $ref: "#/a",
        },
        { a: [] },
      ),
    ).toEqual(null);
  });

  it("should return base array if set and pointee is not array", () => {
    expect(
      parseJsonReferences(
        {
          base: [{ test: 123 }],
          $ref: "#/a",
        },
        { a: null },
      ),
    ).toEqual([{ test: 123 }]);
  });
});

describe("Pascal to Space Separated String", () => {
  it("should covert pascal-case to space separated string", () => {
    expect(pascalToSpace("testString")).toBe("Test String");
  });
});

describe("Circumference point calculator", () => {
  it.each([
    { i: 0, expected: 20 },
    { i: 1, expected: 80 },
    { i: 2, expected: 140 },
    { i: 3, expected: 80 },
  ])(
    "should return X position as $expected for point number $i in circumference",
    ({ i, expected }) => {
      expect(calcCircumferencePos(i, 4, 60, true)).toBeCloseTo(expected);
    },
  );

  it.each([
    { i: 0, expected: 80 },
    { i: 1, expected: 140 },
    { i: 2, expected: 80 },
    { i: 3, expected: 20 },
  ])(
    "should return Y position as $expected for point number $i in circumference",
    ({ i, expected }) => {
      expect(calcCircumferencePos(i, 4, 60, false)).toBeCloseTo(expected);
    },
  );
});
