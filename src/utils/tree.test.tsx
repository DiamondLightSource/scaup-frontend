import { TreeData } from "@/components/visualisation/treeView";
import {
  recursiveCountChildrenByType,
  recursiveCountTypeInstances,
  recursiveFind,
  setTagInPlace,
} from "./tree";

const defaultData: TreeData[] = [
  {
    id: "1",
    name: "",
    data: { type: "dewar" },
    children: [
      {
        id: "2",
        name: "",
        data: { type: "puck" },
        children: [{ id: "3", name: "", data: { type: "gridBox" } }],
      },
    ],
  },
];

describe("Recursively Find Item", () => {
  it("should find leaf item", () => {
    const callback = jest.fn();
    recursiveFind(defaultData, "3", "gridBox", callback);

    expect(callback).toBeCalledWith(
      expect.objectContaining({ id: "3" }),
      0,
      expect.arrayContaining([expect.objectContaining({ id: "3" })]),
    );
  });

  it("should find branch item", () => {
    const callback = jest.fn();
    recursiveFind(defaultData, "2", "puck", callback);

    expect(callback).toBeCalledWith(
      expect.objectContaining({ id: "2" }),
      0,
      expect.arrayContaining([expect.objectContaining({ id: "2" })]),
    );
  });

  it("should find root item", () => {
    const callback = jest.fn();
    recursiveFind(defaultData, "1", "dewar", callback);

    expect(callback).toBeCalledWith(
      expect.objectContaining({ id: "1" }),
      0,
      expect.arrayContaining([expect.objectContaining({ id: "1" })]),
    );
  });

  it("should find item amongst siblings", () => {
    const callback = jest.fn();
    recursiveFind(
      [...defaultData, { id: "4", name: "", data: { type: "dewar" } }],
      "4",
      "dewar",
      callback,
    );

    expect(callback).toBeCalledWith(
      expect.objectContaining({ id: "4" }),
      1,
      expect.arrayContaining([
        expect.objectContaining({ id: "1" }),
        expect.objectContaining({ id: "4" }),
      ]),
    );
  });

  it("should set tags for all objects with positions set", () => {
    const newData = structuredClone(defaultData);
    newData[0].children![0].children![0].data.location = 4;

    setTagInPlace(newData);

    expect(newData[0].children![0].children![0].tag).toBe("5");
  });
});

describe("Recursively Count Children", () => {
  it("should count children of type that exists in multiple places in tree", () => {
    const count = recursiveCountChildrenByType(
      [
        ...defaultData,
        {
          id: "4",
          name: "",
          data: { type: "dewar" },
          children: [{ id: "5", name: "", data: {} }],
        },
      ],
      "dewar",
    );

    expect(count).toBe(2);
  });

  it("should count children of children", () => {
    const newData = structuredClone(defaultData);
    newData[0].children![0].children!.push({ id: "6", data: {}, name: "" });

    const count = recursiveCountChildrenByType(newData, "puck");
    expect(count).toBe(2);
  });

  it("should count the children of multiple types", () => {
    const newData = structuredClone(defaultData);
    newData[0].children!.push({
      id: "6",
      data: { type: "falconTube" },
      name: "",
      children: [{ id: "7", name: "", data: {} }],
    });

    const count = recursiveCountChildrenByType(defaultData, ["puck", "falconTube"]);
    expect(count).toBe(1);
  });
});

describe("Recursively Count Identical Types", () => {
  it("should count item type instances", () => {
    const count = recursiveCountTypeInstances([
      {
        id: "dewar",
        name: "Dewar",
        data: { type: "dewar" },
        children: [
          {
            id: "puck1",
            name: "Puck 1",
            data: { type: "puck" },
            children: [
              { id: "s1", name: "Sample", data: { type: "sample" } },
              { id: "s2", name: "Sample", data: { type: "sample" } },
              { id: "s3", name: "Sample", data: { type: "sample" } },
            ],
          },
          { id: "puck2", name: "Puck 2", data: { type: "puck" } },
        ],
      },
    ]);

    expect(count.dewar).toBe(1);
    expect(count.puck).toBe(2);
    expect(count.sample).toBe(3);
  });
});
