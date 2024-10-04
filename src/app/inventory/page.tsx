import { components } from "@/types/schema";
import { authenticatedFetch } from "@/utils/client";
import { Divider, Grid, Heading, Stat, StatNumber, Text, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import Link from "next/link";
import { TopLevelContainerCreationForm } from "./pageContent";
import { revalidateTag } from "next/cache";

export const metadata: Metadata = {
  title: "Inventory - Sample Handling",
};

const getContainers = async () => {
  const res = await authenticatedFetch.server(`/internal-containers`);

  if (res) {
    switch (res.status) {
      case 200:
        const containers = await res.json();
        return containers.items as components["schemas"]["TopLevelContainerOut"][];
      case 403:
        return null;
    }
  }

  return [];
};

const InventoryPage = async () => {
  const data = await getContainers();

  return (
    <VStack alignItems='start'>
      <VStack gap='0' alignItems='start' w='100%'>
        <Heading size='md' color='gray.600'>
          Internal Containers
        </Heading>
        <Heading>Inventory</Heading>
        <Divider borderColor='gray.800' />
      </VStack>
      {data === null ? (
        <VStack w='100%' mt='3em'>
          <Heading variant='notFound'>Inventory Unavailable</Heading>
          <Text>You do not have permission to view this page.</Text>
        </VStack>
      ) : (
        <>
          <VStack alignItems='start' w='100%'>
            <Text fontSize='18px' mt='2'>
              View existing inventory containers, or add new ones
            </Text>{" "}
            <Heading mt='3' size='lg' color='grey.700'>
              Select Existing Container
            </Heading>
          </VStack>
          {data.length > 0 ? (
            <>
              <Grid templateColumns='repeat(5,1fr)' gap='4px' w='100%'>
                {data.map((tlc, i) => (
                  <Link href={`inventory/${tlc.id}/${tlc.type}/${tlc.id}`} key={i}>
                    <Stat
                      key={i}
                      _hover={{
                        borderColor: "diamond.400",
                      }}
                      bg='white'
                      overflow='hidden'
                      p={2}
                      border='1px solid grey'
                      borderRadius={5}
                      w='100%'
                      cursor='pointer'
                    >
                      <StatNumber>
                        <Text whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                          {tlc.name ?? "No Name"}
                        </Text>
                      </StatNumber>
                    </Stat>
                  </Link>
                ))}
              </Grid>
              <Heading
                size='md'
                borderLeft='3px solid'
                p='0.5em'
                my='0.5em'
                borderColor='diamond.800'
              >
                or
              </Heading>
            </>
          ) : (
            <Text fontWeight='600'>There are no containers in the inventory yet. You can:</Text>
          )}
          <TopLevelContainerCreationForm />
        </>
      )}
    </VStack>
  );
};

export default InventoryPage;
