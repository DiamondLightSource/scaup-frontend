import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, Step } from "@/mappings/pages";
import { CreationResponse } from "@/types/server";
import { authenticatedFetch } from "@/utils/client";
import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

const displayError = async (action: string, response: Response | undefined) => {
  let details = "Internal server error";
  try {
    if (response) {
      const respBody = await response.json();
      details = respBody.detail;
    }
  } catch {}
  toast({ title: `Failed to ${action} item`, description: details, status: "error" });
};

const genericCreateItem = async (requestUrl: string, data: Record<string, any>) => {
  const response = await authenticatedFetch.client(requestUrl, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response && response.status === 201) {
    const newItem = await response.json();
    return newItem.items ? newItem.items : newItem;
  } else {
    displayError("create", response);
    throw new Error(`Failed to create item`);
  }
};
export class Item {
  static async patch(
    itemId: TreeData["id"],
    data: Omit<BaseShipmentItem, "type">,
    endpoint: Step["endpoint"],
  ) {
    const response = await authenticatedFetch.client(`/${endpoint}/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (response && response.status === 200) {
      return (await response.json()) as CreationResponse;
    } else {
      displayError("modify", response);
      throw new Error("Failed to modify item");
    }
  }

  static async createShipment(proposalId: string, visitNumber: string, data: Record<string, any>) {
    return genericCreateItem(`/proposals/${proposalId}/sessions/${visitNumber}/shipments`, data);
  }

  static async create(
    parentId: TreeData["id"],
    data: Record<string, any>,
    endpoint: Step["endpoint"],
  ): Promise<CreationResponse | CreationResponse[]> {
    return genericCreateItem(`/shipments/${parentId}/${endpoint}`, data);
  }

  static async delete(itemId: TreeData["id"], endpoint: Step["endpoint"]) {
    const response = await authenticatedFetch.client(`/${endpoint}/${itemId}`, {
      method: "DELETE",
    });

    if (response && response.status === 204) {
      return { status: "OK" };
    } else {
      displayError("delete", response);
      throw new Error("Failed to delete item");
    }
  }
}
