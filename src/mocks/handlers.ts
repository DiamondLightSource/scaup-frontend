import { pluralToSingular } from "@/mappings/pages";
import { http, HttpResponse } from "msw";

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
  // Shipments
  http.post("http://localhost/api/proposals/:proposalId/sessions/:visitNumber/shipments", () =>
    HttpResponse.json({ id: 123, data: { name: "Test" } }, { status: 201 }),
  ),

  http.get(
    "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/shipments",
    () => HttpResponse.json({ items: [defaultData] }),
  ),

  http.get("http://localhost/api/shipments/:shipmentId", () => HttpResponse.json(defaultData)),

  http.post("http://localhost/api/shipments/:shipmentId/push", () =>
    HttpResponse.json({}, { status: 200 }),
  ),

  http.put("http://localhost/api/shipments/:shipmentId/preSession", () =>
    HttpResponse.json({}, { status: 201 }),
  ),

  http.get("http://localhost/api/shipments/:shipmentId/preSession", () =>
    HttpResponse.json({ details: { pixelSize: 1 } }, { status: 200 }),
  ),

  http.post("http://localhost/api/shipments/:shipmentId/request", () =>
    HttpResponse.json({ shipmentRequest: 20, status: "Booked" }, { status: 201 }),
  ),

  http.get("http://localhost/api/shipments/:shipmentId/unassigned", () =>
    HttpResponse.json({ samples: [], containers: [], gridBoxes: [] }),
  ),

  // Top Level Containers

  http.get("http://localhost/api/shipments/:shipmentId/topLevelContainers", () =>
    HttpResponse.json({
      items: [{ externalId: 1, status: "Booked", id: 1, name: "Dewar-001" }],
      total: 1,
      limit: 20,
    }),
  ),

  // Samples

  http.get("http://localhost/api/shipments/:shipmentId/samples", () =>
    HttpResponse.json({
      items: [{ parent: "Container", id: 1, name: "Sample" }],
      total: 1,
      limit: 20,
    }),
  ),

  // Containers

  http.get(
    "http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/containers",
    () =>
      HttpResponse.json({
        items: [{ name: "Container", id: 1 }],
        total: 1,
        limit: 20,
      }),
  ),

  // Proposal metadata

  http.get("http://localhost/api/proposals/:proposalReference/data", () =>
    HttpResponse.json({ labContacts: [], proteins: [], containers: [] }),
  ),

  // Item CRUD

  http.post("http://localhost/api/shipments/:shipmentId/:itemType", ({ params }) => {
    const itemType = pluralToSingular[params.itemType as string];
    return HttpResponse.json({ id: 123, data: { type: itemType } }, { status: 201 });
  }),

  http.patch("http://localhost/api/:itemType/:itemId", () => HttpResponse.json({ id: 123 })),

  http.delete(
    "http://localhost/api/:itemType/:itemId",
    () => new HttpResponse(null, { status: 204 }),
  ),
];
