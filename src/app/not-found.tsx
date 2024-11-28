import { Text, Heading, Link, VStack } from "@chakra-ui/react";
import { Metadata } from "next/types";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "404 - Sample Handling",
};

const PageNotFound = () => (
  <VStack h='100%' w='100%' justifyContent='center'>
    <Heading variant='notFound'>Page not found</Heading>
    <Text>This page does not exist.</Text>
    <Link as={NextLink} href='/'>
      Go home
    </Link>
  </VStack>
);

export default PageNotFound;
