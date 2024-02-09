import { components } from "./schema";

type schemas = components["schemas"];

export type UnassignedItemResponse = schemas["UnassignedItems"];

export type CreationResponse =
  | schemas["ContainerOut"]
  | schemas["SampleOut"]
  | schemas["TopLevelContainerOut"];
