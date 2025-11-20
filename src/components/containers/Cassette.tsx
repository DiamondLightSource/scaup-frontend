"use client";

import { ChildSelector } from "@/components/containers/ChildSelector";
import { TreeData } from "@/components/visualisation/treeView";
import { BaseShipmentItem } from "@/mappings/pages";
import { Button, Heading, List, Spacer, Tag, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { PositionedItem } from "@/mappings/forms/sample";
import { components } from "@/types/schema";
import { Item } from "@/utils/client/item";

export interface CassetteProps {
  samples: components["schemas"]["SampleOut"][];
}

export const Cassette = ({ samples }: CassetteProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentItem, setCurrentItem] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const items = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newSamples = Array(12).fill(null);
    for (const sample of samples) {
      // Populate in reverse
      if (sample.subLocation) {
        newSamples[12 - sample.subLocation] = { id: sample.id, name: sample.name, data: {} };
      }
    }
    return newSamples;
  }, [samples]);

  const selectableSamples = useMemo<Array<TreeData>>(
    () =>
      samples.reduce((selectable, sample) => {
        if (sample.subLocation === null) {
          selectable.push({
            id: sample.id,
            name: sample.name || "",
            data: {
              type: sample.type,
              displayDetails: [
                { label: "Grid Box Name", value: sample.containerName },
                { label: "Location", value: sample.location },
              ],
            },
          });
        }
        return selectable;
      }, [] as TreeData[]),
    [samples],
  );

  const handlePopulatePosition = useCallback(
    async (sample: TreeData<BaseShipmentItem>) => {
      await Item.patch(sample.id, { subLocation: currentPosition }, "samples");
    },
    [currentPosition],
  );

  const handleRemoveSample = useCallback(async (sample: TreeData<BaseShipmentItem>) => {
    await Item.patch(sample.id, { subLocation: null }, "samples");
  }, []);

  const handlePositionClicked = useCallback(
    (sample: TreeData<PositionedItem> | null, i: number) => {
      setCurrentItem(sample);
      setCurrentPosition(i);
      onOpen();
    },
    [onOpen],
  );

  return (
    <VStack
      w='296px'
      h='22em'
      p='10px'
      m='20px'
      border='3px solid'
      borderColor='diamond.700'
      bg='#D0E0FF'
    >
      <Heading
        fontSize='24px'
        w='100%'
        borderBottom='1px solid'
        borderColor='gray.800'
        mb='5px'
        pb='3px'
      >
        Cassette
      </Heading>
      <List overflowY='scroll' w='100%'>
        {items.map((item, i) => (
          <Button
            key={i}
            p='5px'
            display='flex'
            bg={item === null ? "diamond.75" : "diamond.700"}
            mb='3px'
            borderRadius='4px'
            onClick={() => handlePositionClicked(item, 12 - i)}
            border='2px solid'
            borderColor='diamond.700'
            w='100%'
          >
            <Tag colorScheme='teal' minW='30px' justifyContent='center' flexShrink='0'>
              {12 - i}
            </Tag>
            <Text
              px='10px'
              fontWeight='600'
              color={item === null ? "diamond.800" : "diamond.50"}
              overflowX='hidden'
              textOverflow='ellipsis'
            >
              {item?.name ?? ""}
            </Text>
            <Spacer />
          </Button>
        ))}
      </List>
      <ChildSelector
        childrenType='sample'
        onSelect={handlePopulatePosition}
        onRemove={handleRemoveSample}
        selectedItem={currentItem}
        isOpen={isOpen}
        onClose={onClose}
        displayDetails={true}
        selectableChildren={selectableSamples}
      />
    </VStack>
  );
};
