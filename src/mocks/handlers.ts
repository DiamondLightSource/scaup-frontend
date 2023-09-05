import { rest } from "msw";

export const defaultData = {
  id: "1",
  name: "Shipment",
  data: {},
  children: [
    {
      name: "Dewar",
      id: "1",
      data: { type: "dewar" },
      children: [
        {
          name: "Falcon Tube",
          id: "2",
          data: { type: "container" },
          children: [
            {
              name: "Grid Box 1",
              data: { type: "gridBox" },
              id: "3",
              children: [{ name: "Sample 1", id: "7" }],
            },
          ],
        },
        {
          name: "Puck",
          id: "4",
          data: { type: "container" },
          children: [
            {
              name: "Grid Box 2",
              data: { type: "gridBox" },
              id: "5",
              children: [{ name: "Sample 2", id: "6" }],
            },
          ],
        },
      ],
    },
  ],
};

export const handlers = [
  rest.get("http://localhost/api/shipments/:shipmentId", (req, res, ctx) =>
    res(ctx.status(200), ctx.json(defaultData)),
  ),

  rest.get("http://localhost/api/proposals/:proposalReference/data", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ labContacts: [], proteins: [] })),
  ),

  rest.get("http://localhost/api/shipments/:shipmentId/unassigned", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ samples: [], containers: [], gridBoxes: [] })),
  ),

  rest.post("http://localhost/api/shipments/:shipmentId/:itemType", (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ itemId: 123 })),
  ),

  rest.patch("http://localhost/api/shipments/:shipmentId/:itemType/:itemId", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ itemId: 123 })),
  ),

  rest.delete("http://localhost/api/shipments/:shipmentId/:itemType/:itemId", (req, res, ctx) =>
    res(ctx.status(204), ctx.json({})),
  ),
];
