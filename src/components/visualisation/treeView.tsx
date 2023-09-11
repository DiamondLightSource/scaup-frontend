import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Spacer,
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

export interface TreeViewProps extends AccordionProps {
  data: TreeData[];
  onRemove?: (data: TreeData) => void;
  onEdit?: (data: TreeData) => void;
}

export const TreeView = ({ data, onRemove, onEdit, ...props }: TreeViewProps) => {
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

  return (
    <Accordion allowMultiple {...props} defaultIndex={[...Array(data.length).keys()]}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {!item.children || item.children.length < 1 ? (
            <List spacing={3} py={1} pt={2}>
              <ListItem ml={5}>
                <HStack>
                  {item.tag !== undefined && <Tag colorScheme='teal'>{item.tag}</Tag>}
                  <Text>{item.name}</Text>
                  <Spacer />
                  {!item.isUndeletable && (
                    <Button size='xs' onClick={() => handleRemove(item)}>
                      Remove
                    </Button>
                  )}
                  {!item.isNotViewable && (
                    <Button size='xs' onClick={() => handleEdit(item)}>
                      View
                    </Button>
                  )}
                </HStack>
              </ListItem>
            </List>
          ) : (
            <AccordionItem border='none'>
              <HStack w='100%' borderBottom='1px solid' borderBottomColor='gray.800'>
                <AccordionButton>
                  <AccordionIcon />
                  <Box flex='1' textAlign='left'>
                    {item.tag !== undefined && <Tag colorScheme='teal'>{item.tag}</Tag>}
                    <Text fontSize='md'>{item.name}</Text>
                  </Box>
                </AccordionButton>
                {!item.isNotViewable && (
                  <Button size='xs' onClick={() => handleEdit(item)}>
                    View
                  </Button>
                )}
              </HStack>
              <AccordionPanel py='0' pr='0'>
                <TreeView data={item.children} onRemove={onRemove} onEdit={onEdit} {...props} />
              </AccordionPanel>
            </AccordionItem>
          )}
        </React.Fragment>
      ))}
    </Accordion>
  );
};
