import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem, Step } from "@/mappings/pages";
import { RootParentType } from "@/types/generic";
import { CreationResponse } from "@/types/server";
import { createStandaloneToast } from "@chakra-ui/react";
import { parentTypeToEndpoint } from "@/utils/client/shipment";
import { requestAndInvalidate } from "@/utils/server/request";
import { parseNetworkError } from "../generic";

const { toast } = createStandaloneToast();

export const displayError = async (action: string, response?: Record<string, any>) => {
  toast({
    title: `Failed to ${action} item`,
    description: parseNetworkError(response),
    status: "error",
  });
};

const genericCreateItem = async (requestUrl: string, data: Record<string, any>) => {
  const response = await requestAndInvalidate(requestUrl, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.status === 201) {
    return response.json.items || response.json;
  } else {
    displayError("create", response.json);
  }
};
export class Item {
  static async patch(
    itemId: TreeData["id"],
    data: Omit<BaseShipmentItem, "type">,
    endpoint: Step["endpoint"],
  ) {
    const response = await requestAndInvalidate(`/${endpoint}/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      return response.json as CreationResponse;
    } else {
      displayError("modify", response.json);
    }
  }

  static async createShipment(proposalId: string, visitNumber: string, data: Record<string, any>) {
    return await genericCreateItem(
      `/proposals/${proposalId}/sessions/${visitNumber}/shipments`,
      data,
    );
  }

  static async create(
    parentId: TreeData["id"] | null,
    data: Record<string, any>,
    endpoint: Step["endpoint"],
    parentType: RootParentType = "shipment",
    searchParams?: URLSearchParams
  ): Promise<CreationResponse | CreationResponse[]> {
    const parentEndpoint = parentTypeToEndpoint[parentType];
    const searchParamText = searchParams ? "?" + searchParams.toString() : "";

    return await genericCreateItem(
      `/${parentEndpoint}${parentType === "shipment" && parentId ? `/${parentId}` : ""}/${endpoint}${searchParamText}`,
      data,
    );
  }

  static async delete(itemId: TreeData["id"], endpoint: Step["endpoint"]) {
    const response = await requestAndInvalidate(`/${endpoint}/${itemId}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      return { status: "OK" };
    } else {
      displayError("delete", response.json);
    }
  }
}
