import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import { mockSession } from "../../../jest.setup";
import { Item } from "./item";

describe("Item Creation", () => {
  it("should throw if request fails", async () => {
    server.use(
      http.post("http://localhost/api/shipments/1/samples", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );

    await expect(Item.create(mockSession, 1, {}, "samples")).rejects.toThrow();
  });

  it("should return item creation response", async () => {
    const itemResponse = await Item.create(mockSession, 1, {}, "samples");
    expect(itemResponse).toEqual({ data: { type: "sample" }, id: 123 });
  });

  it("should use different URL for creating shipments", async () => {
    server.use(
      http.post(
        "http://localhost/api/proposals/1/shipments",
        () => HttpResponse.json({ name: "Test" }, { status: 201 }),
        { once: true },
      ),
    );

    const itemResponse = await Item.create(mockSession, 1, { name: "Test " }, "shipments");
    expect(itemResponse).toEqual({ name: "Test" });
  });
});

describe("Item Modification", () => {
  it("should return item modification response", async () => {
    const itemResponse = await Item.patch(mockSession, 1, {}, "samples");
    expect(itemResponse).toEqual({ id: 123 });
  });

  it("should throw if request fails", async () => {
    server.use(
      http.patch("http://localhost/api/samples/1", () => HttpResponse.json({}, { status: 404 }), {
        once: true,
      }),
    );

    await expect(Item.patch(mockSession, 1, {}, "samples")).rejects.toThrow();
  });
});

describe("Item Deletion", () => {
  it("should return item deletion response", async () => {
    const itemResponse = await Item.delete(mockSession, 1, "samples");
  });

  it("should throw if request fails", async () => {
    server.use(
      http.delete("http://localhost/api/samples/1", () => HttpResponse.json({}, { status: 404 }), {
        once: true,
      }),
    );

    await expect(Item.delete(mockSession, 1, "samples")).rejects.toThrow();
  });
});
