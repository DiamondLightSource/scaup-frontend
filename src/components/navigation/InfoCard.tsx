"use client";

import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { MdArrowForward } from "react-icons/md";

export interface InfoBoxProps {
  title: string;
  children: string;
  href: string;
}

export const InfoBox = ({ title, children, href }: InfoBoxProps) => (
  <Box
    flex='1 0 0'
    minW='300px'
    as={NextLink}
    href={href}
    alignItems='start'
    p='1em'
    position='relative'
    color='diamond.500'
    borderColor='diamond.500'
    border='1px solid'
    _hover={{ backgroundColor: "diamond.700" }}
  >
    <VStack alignItems='start'>
      <Heading>{title}</Heading>
      <Text fontSize='20px' h='4em'>
        {children}
      </Text>
      <HStack w='100%' justifyContent='space-between' color='diamond.500'>
        <Text fontWeight='600' fontSize='20px'>
          View
        </Text>
        <MdArrowForward fontSize='20px' />
      </HStack>
    </VStack>
  </Box>
);