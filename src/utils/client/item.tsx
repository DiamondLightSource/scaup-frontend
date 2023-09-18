import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, Step } from "@/mappings/pages";
import { authenticatedFetch } from "@/utils/client";
import { createStandaloneToast } from "@chakra-ui/react";
import { Session } from "next-auth";

const { toast } = createStandaloneToast();

export class Item {
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
      Promise.reject();
    }
  }

  static async create(
    session: Session | null,
    shipmentId: TreeData["id"],
    data: BaseShipmentItem,
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
      Promise.reject();
    }
  }
}
