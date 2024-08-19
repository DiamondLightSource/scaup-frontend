import { Button, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Sample Handling",
};

const Home = () => (
  <main>
    <VStack mx='-7.3vw' px='10vw' py='4vh' bg='diamond.700' alignItems='start' color='diamond.50'>
      <Heading>Sample Handling</Heading>
      <Heading size='md' fontWeight='200'>
        Sample information registration and shipping
      </Heading>
      <Link href={`${process.env.PATO_URL}/proposals`}>
        <Button variant='onBlue'>List Proposals</Button>
      </Link>
    </VStack>
  </main>
);

export default Home;
