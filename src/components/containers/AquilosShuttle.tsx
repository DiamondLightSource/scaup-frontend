"use client";

import { ChildSelector } from "@/components/containers/ChildSelector";
import { TreeData } from "@/types/forms";
import { BaseShipmentItem } from "@/mappings/pages";
import {
  Button,
  Divider,
  Heading,
  HStack,
  Spacer,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { PositionedItem } from "@/mappings/forms/sample";
import { components } from "@/types/schema";
import { Item } from "@/utils/client/item";
import { getSelectable } from "@/utils/tree";

export interface AquilosShuttleProps {
  samples: components["schemas"]["SampleOut"][];
}

export const AquilosShuttle = ({ samples }: AquilosShuttleProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentItem, setCurrentItem] = useState<TreeData<PositionedItem> | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const items = useMemo<Array<TreeData<PositionedItem> | null>>(() => {
    const newSamples = Array(4).fill(null);
    for (const sample of samples) {
      // Populate in reverse
      if (sample.subLocation !== undefined && sample.subLocation !== null) {
        newSamples[sample.subLocation] = { id: sample.id, name: sample.name, data: {} };
      }
    }
    return newSamples;
  }, [samples]);

  const selectableSamples = getSelectable(samples);

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
    <VStack w='496px' p='10px' m='20px' border='3px solid' borderColor='diamond.700' bg='#D0E0FF'>
      <Heading
        fontSize='24px'
        w='100%'
        borderBottom='1px solid'
        borderColor='gray.800'
        mb='5px'
        pb='3px'
      >
        Shuttles
      </Heading>
      <HStack w='100%'>
        <VStack w='100%' alignItems='left' divider={<Divider borderColor='black' />}>
          {[0, 2].map((shuttleRow, i) => (
            <>
              <Heading pt='0.5em' size='sm'>
                Shuttle {i + 1}
              </Heading>
              <HStack key={shuttleRow} w='100%'>
                {items.slice(shuttleRow, shuttleRow + 2).map((item, j) => (
                  <Button
                    key={`{i}-{j}`}
                    p='5px'
                    flex='1 0 0'
                    display='flex'
                    bg={item === null ? "diamond.75" : "diamond.700"}
                    mb='3px'
                    borderRadius='4px'
                    onClick={() => handlePositionClicked(item, shuttleRow + j)}
                    border='2px solid'
                    borderColor='diamond.700'
                    w='100%'
                  >
                    <Tag colorScheme='teal' minW='30px' justifyContent='center' flexShrink='0'>
                      {j + 1}
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
              </HStack>
            </>
          ))}
        </VStack>
      </HStack>
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
