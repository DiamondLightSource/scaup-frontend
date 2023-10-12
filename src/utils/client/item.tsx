import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, Step } from "@/mappings/pages";
import { authenticatedFetch } from "@/utils/client";
import { createStandaloneToast } from "@chakra-ui/react";
import { Session } from "next-auth";

const { toast } = createStandaloneToast();

export class Item {
  // TODO: type this properly
  static async patch(
    session: Session | null,
    shipmentId: TreeData["id"],
    itemId: TreeData["id"],
    data: Omit<BaseShipmentItem, "type">,
    endpoint: Step["endpoint"],
  ) {
    const response = await authenticatedFetch.client(
      `/shipments/${shipmentId}/${endpoint}/${itemId}`,
      session,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

    if (response && response.status === 200) {
      return await response.json();
    } else {
      toast({ title: "Failed to modify item", status: "error" });
      throw new Error("Failed to modify item");
    }
  }

  // TODO: type this properly
  static async create(
    session: Session | null,
    shipmentId: TreeData["id"],
    data: Record<string, any>,
    endpoint: Step["endpoint"],
  ) {
    const response = await authenticatedFetch.client(
      `/shipments/${shipmentId}/${endpoint}`,
      session,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    if (response && response.status === 201) {
      return await response.json();
    } else {
      toast({ title: "Failed to create item", status: "error" });
      throw new Error("Failed to create item");
    }
  }

  static async delete(
    session: Session | null,
    shipmentId: TreeData["id"],
    itemId: TreeData["id"],
    endpoint: Step["endpoint"],
  ) {
    const response = await authenticatedFetch.client(
      `/shipments/${shipmentId}/${endpoint}/${itemId}`,
      session,
      {
        method: "DELETE",
      },
    );

    if (response && response.status === 204) {
      return { status: "OK" };
    } else {
      toast({ title: "Failed to delete item", status: "error" });
      throw new Error("Failed to delete item");
    }
  }
}
