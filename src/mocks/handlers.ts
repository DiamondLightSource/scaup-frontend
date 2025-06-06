import { pluralToSingular } from "@/mappings/pages";
import { http, HttpResponse } from "msw";

export const defaultData = {
  id: 1,
  name: "Shipment",
  data: { proposalNumber: "123", proposalCode: "cm", visitNumber: 1 },
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
      items: [
        {
          externalId: 1,
          status: "Booked",
          id: 1,
          name: "Dewar-001",
          history: [
            {
              storageLocation: "m01",
              dewarId: 1,
              dewarStatus: "opened",
              arrivalDate: "2025-01-01T00:00:00Z",
            },
          ],
        },
      ],
      total: 1,
      limit: 20,
    }),
  ),

  http.post("http://localhost/api/internal-containers/topLevelContainers", () =>
    HttpResponse.json({ name: "TLC Name", id: 1 }, { status: 201 }),
  ),

  // Samples

  http.get("http://localhost/api/shipments/:shipmentId/samples", () =>
    HttpResponse.json({
      items: [{ container: "Container", id: 1, name: "Sample" }],
      total: 1,
      limit: 20,
    }),
  ),

  http.get("http://localhost/api/proposals/:proposalReference/sessions/:visitNumber/samples", () =>
    HttpResponse.json({
      items: [
        {
          id: 1,
          name: "sample-in-session",
          parentShipmentName: "test-shipment",
          data: { type: "sample" },
        },
      ],
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

  http.get("http://localhost/api/containers/:containerId", () =>
    HttpResponse.json({ name: "Container", id: 1, shipmentId: 1, type: "gridBox" }),
  ),

  http.post("http://localhost/api/internal-containers/containers", () =>
    HttpResponse.json({ name: "Container", id: 1, type: "puck" }, { status: 201 }),
  ),

  // Inventory

  http.get("http://localhost/api/internal-containers", () =>
    HttpResponse.json({
      items: [{ name: "Container", id: 1, type: "puck" }],
      total: 1,
      limit: 20,
    }),
  ),

  http.get("http://localhost/api/internal-containers/unassigned", () =>
    HttpResponse.json({
      items: [{ name: "Container", id: 1, data: { type: "puck" } }],
      total: 1,
      limit: 20,
    }),
  ),

  http.get("http://localhost/api/internal-containers/:topLevelContainerId", () =>
    HttpResponse.json(defaultData),
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
