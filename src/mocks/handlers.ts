import { TreeData } from "@/components/treeView";
import { rest } from "msw";

const defaultData = [
  {
    label: "Dewar",
    id: "dewar-1",
    data: { type: "dewar" },
    children: [
      {
        label: "Falcon Tube",
        id: "ftube",
        data: { type: "container" },
        children: [
          {
            label: "Grid Box 1",
            data: { type: "gridBox" },
            id: "grid-box-1",
            children: [{ label: "Sample 1", id: "sample-1" }],
          },
        ],
      },
      {
        label: "Puck",
        id: "puck",
        data: { type: "container" },
        children: [
          {
            label: "Grid Box 2",
            data: { type: "gridBox" },
            id: "grid-box-2",
            children: [{ label: "Sample 2", id: "sample-2" }],
          },
        ],
      },
    ],
  },
] as TreeData[];

export const handlers = [
  rest.get("https://api.co.uk/api/shipment/:shipmentId", (req, res, ctx) =>
    res(ctx.status(200), ctx.json(defaultData)),
  ),
];
