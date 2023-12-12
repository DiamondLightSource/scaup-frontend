import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Button,
  HStack,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, { useCallback } from "react";

export interface TreeData<T = any> {
  /** Node label */
  name: string;
  /** Unique node ID */
  id: string | number;
  /** Tag prefixed to label */
  tag?: string;
  /** Node data */
  data: T;
  /** Node children */
  children?: TreeData[];
  /** Should 'remove' button be invisible */
  isUndeletable?: boolean;
  /** Should 'view' button be invisible */
  isNotViewable?: boolean;
}

import "@/styles/tree.css";

export interface TreeViewProps extends AccordionProps {
  data: TreeData[];
  onRemove?: (data: TreeData) => void;
  onEdit?: (data: TreeData) => void;
  /** Disable edit/remove buttons */
  readOnly?: boolean;
  selectedItem?: TreeData;
}

const hasChildren = (item: TreeData) => !!(item.children && item.children.length > 0);

export const TreeView = ({
  data,
  onRemove,
  readOnly = false,
  onEdit,
  selectedItem,
  ...props
}: TreeViewProps) => {
  /*
  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement>, data: TreeData) => {
    event.dataTransfer.setData("text", JSON.stringify(data));
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(event.dataTransfer.getData("text"))
  }, []);
  */

  const handleRemove = useCallback(
    (item: TreeData) => {
      if (onRemove) {
        onRemove(item);
      }
    },
    [onRemove],
  );

  const handleEdit = useCallback(
    (item: TreeData) => {
      if (onEdit) {
        onEdit(item);
      }
    },
    [onEdit],
  );

  // Whenever comparing items in the list, I actually want to compare by reference, not by value.
  return (
    <Accordion allowMultiple {...props} defaultIndex={[0, 1, 2, 3]}>
      {data.map((item, index) => {
        const isSelected = item === selectedItem;
        return (
          <React.Fragment key={index}>
            <AccordionItem border='none'>
              <HStack
                w='100%'
                h='36px'
                className={item.isNotViewable ? "unclickable-row" : "clickable-row"}
                bg={isSelected ? "diamond.100" : "transparent"}
              >
                <h2
                  style={{
                    width: "100%",
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <AccordionButton w='auto' p='8px' aria-label={`Expand ${item.name}`}>
                    {hasChildren(item) ? (
                      <AccordionIcon />
                    ) : (
                      <Text px='15px' aria-hidden='true'>
                        ⦁
                      </Text>
                    )}
                  </AccordionButton>
                  <HStack
                    alignItems='center'
                    w='100%'
                    h='100%'
                    onClick={item.isNotViewable ? undefined : () => handleEdit(item)}
                    aria-label={item.isNotViewable ? undefined : `View ${item.name}`}
                    aria-current={isSelected}
                  >
                    {item.tag !== undefined && <Tag colorScheme='teal'>{item.tag}</Tag>}
                    <Text fontSize='md' fontWeight={isSelected ? "600" : "200"}>
                      {item.name}
                    </Text>
                  </HStack>
                </h2>

                {!(item.isUndeletable || readOnly || hasChildren(item)) && (
                  <Button bg='red.600' mr='1' size='xs' onClick={() => handleRemove(item)}>
                    Remove
                  </Button>
                )}
              </HStack>
              {hasChildren(item) && (
                <AccordionPanel py='0' pr='0'>
                  <TreeView
                    data={item.children!}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    readOnly={readOnly}
                    selectedItem={selectedItem}
                    {...props}
                  />
                </AccordionPanel>
              )}
            </AccordionItem>
          </React.Fragment>
        );
      })}
    </Accordion>
  );
};
