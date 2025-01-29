import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";

import { Item, displayError } from "@/utils/client/item";
import { toastMock } from "@/../vitest.setup";

describe("Item Creation", () => {
  it("should display toast if request fails", async () => {
    server.use(
      http.post("http://localhost/api/shipments/1/samples", () =>
        HttpResponse.json({}, { status: 404 }),
      ),
    );

    await Item.create(1, {}, "samples");
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Failed to create item" }),
    );
  });

  it("should return item creation response", async () => {
    const itemResponse = await Item.create(1, {}, "samples");
    expect(itemResponse).toEqual({ data: { type: "sample" }, id: 123 });
  });

  it("should create shipments", async () => {
    server.use(
      http.post(
        "http://localhost/api/proposals/cm1/sessions/1/shipments",
        () => HttpResponse.json({ name: "Test" }, { status: 201 }),
        { once: true },
      ),
    );

    const itemResponse = await Item.createShipment("cm1", "1", { name: "Test " });
    expect(itemResponse).toEqual({ name: "Test" });
  });
});

describe("Item Modification", () => {
  it("should return item modification response", async () => {
    const itemResponse = await Item.patch(1, {}, "samples");
    expect(itemResponse).toEqual({ id: 123 });
  });

  it("should display toast if request fails", async () => {
    server.use(
      http.patch("http://localhost/api/samples/1", () => HttpResponse.json({}, { status: 404 }), {
        once: true,
      }),
    );

    await Item.patch(1, {}, "samples");
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Failed to modify item" }),
    );
  });
});

describe("Item Deletion", () => {
  it("should delete item", async () => {
    await Item.delete(1, "samples");
  });

  it("should display toast if request fails", async () => {
    server.use(
      http.delete("http://localhost/api/samples/1", () => HttpResponse.json({}, { status: 404 }), {
        once: true,
      }),
    );

    await Item.delete(1, "samples");
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Failed to delete item" }),
    );
  });
});

describe("Error Handling", () => {
  it("should display error if details are available", () => {
    displayError("create", { detail: "Test Detail" });
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Failed to create item", description: "Test Detail" }),
    );
  });

  it("should display error if details are available (as array)", () => {
    displayError("create", { detail: [{ msg: "Test Detail In Array" }] });
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Failed to create item",
        description: "Test Detail In Array",
      }),
    );
  });

  it("should display default error message if no details are available", () => {
    displayError("create", { notDetail: "not a detail message" });
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Failed to create item",
        description: "Internal server error",
      }),
    );
  });
});
