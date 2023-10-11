import { server } from "@/mocks/server";
import { rest } from "msw";
import { mockSession } from "../../../jest.setup";
import { Item } from "./item";

describe("Item Creation", () => {
  it("should throw if request fails", async () => {
    server.use(
      rest.post("http://localhost/api/shipments/1/samples", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    await expect(Item.create(mockSession, 1, {}, "samples")).rejects.toThrow();
  });

  it("should return item creation response", async () => {
    const itemResponse = await Item.create(mockSession, 1, {}, "samples");
    expect(itemResponse).toEqual({ data: { type: "sample" }, id: 123 });
  });
});

describe("Item Modification", () => {
  it("should return item modification response", async () => {
    const itemResponse = await Item.patch(mockSession, 1, 1, {}, "samples");
    expect(itemResponse).toEqual({ id: 123 });
  });

  it("should throw if request fails", async () => {
    server.use(
      rest.patch("http://localhost/api/shipments/:shipmentId/samples/1", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    await expect(Item.patch(mockSession, 1, 1, {}, "samples")).rejects.toThrow();
  });
});

describe("Item Deletion", () => {
  it("should return item deletion response", async () => {
    const itemResponse = await Item.delete(mockSession, 1, 1, "samples");
    console.log(itemResponse);
  });

  it("should throw if request fails", async () => {
    server.use(
      rest.delete("http://localhost/api/shipments/:shipmentId/samples/1", (req, res, ctx) =>
        res.once(ctx.status(404)),
      ),
    );

    await expect(Item.delete(mockSession, 1, 1, "samples")).rejects.toThrow();
  });
});
