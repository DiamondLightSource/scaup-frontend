import { pluralToSingular } from "@/mappings/pages";
import { rest } from "msw";

export const defaultData = {
  id: 1,
  name: "Shipment",
  data: {},
  children: [
    {
      name: "Dewar",
      id: 1,
      data: { type: "dewar" },
      children: [
        {
          name: "Falcon Tube",
          id: 2,
          data: { type: "falconTube" },
          children: [
            {
              name: "Grid Box 1",
              data: { type: "gridBox" },
              id: 3,
              children: [{ name: "Sample 1", id: "7", data: { type: "sample" } }],
            },
          ],
        },
        {
          name: "Puck",
          id: 4,
          data: { type: "puck" },
          children: [
            {
              name: "Grid Box 2",
              data: { type: "gridBox" },
              id: 5,
              children: [{ name: "Sample 2", id: "6", data: { type: "sample" } }],
            },
          ],
        },
      ],
    },
  ],
};

export const handlers = [
  rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
    res(ctx.status(200), ctx.json(defaultData), ctx.delay(0)),
  ),

  rest.get("http://localhost/api/proposals/:proposalReference/data", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ labContacts: [], proteins: [] }), ctx.delay(0)),
  ),

  rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ samples: [], containers: [], gridBoxes: [] }), ctx.delay(0)),
  ),

  rest.post("http://localhost/api/shipments/:shipmentId/:itemType", (req, res, ctx) => {
    const itemType = pluralToSingular[req.params.itemType as string];
    return res(ctx.status(201), ctx.json({ id: 123, data: { type: itemType } }), ctx.delay(0));
  }),

  rest.patch("http://localhost/api/shipments/:shipmentId/:itemType/:itemId", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ id: 123 }), ctx.delay(0)),
  ),

  rest.delete("http://localhost/api/shipments/:shipmentId/:itemType/:itemId", (req, res, ctx) =>
    res(ctx.status(204), ctx.json({}), ctx.delay(0)),
  ),
];
