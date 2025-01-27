"use client";

import { ShipmentParams } from "@/types/generic";
import { components } from "@/types/schema";
import { Button, Link } from "@chakra-ui/react";
import { Table } from "@diamondlightsource/ui-components";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface ShipmentHomeData {
  counts: Record<string, number>;
  samples: components["schemas"]["SampleOut"][];
  dispatch: Record<string, number | string>;
  name: string;
  preSessionInfo: Record<string, any> | null;
  hasUnassigned: boolean;
}

export interface ShipmentHomeContentProps {
  data: ShipmentHomeData;
  params: ShipmentParams;
  patoUrl: string;
}

const ShipmentHomeContent = ({ data, params, patoUrl }: ShipmentHomeContentProps) => {
  const router = useRouter();

  const handleSampleClicked = useCallback(
    (item: Record<string, any>) => {
      router.push(`${params.shipmentId}/${item.type}/${item.id}/review`);
    },
    [router, params],
  );

  const samplesWithActions = useMemo(() => {
    const patoPrefix = `${patoUrl}/proposals/${params.proposalId}/sessions/${params.visitNumber}/groups/`;
    return data.samples.map((sample) => ({
      ...sample,
      actions: sample.dataCollectionGroupId ? (
        <Button size='xs' as={Link} href={patoPrefix + sample.dataCollectionGroupId}>
          View Data
        </Button>
      ) : null,
    }));
  }, [data, params, patoUrl]);

  return (
    <Table
      flex='1 0 0'
      headers={[
        { key: "name", label: "name" },
        { key: "status", label: "status" },
        { key: "parent", label: "parent" },
        { key: "location", label: "location" },
        { key: "actions", label: "" },
      ]}
      data={samplesWithActions}
      onClick={handleSampleClicked}
    />
  );
};

export default ShipmentHomeContent;
