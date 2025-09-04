import { Link, Heading, HStack, Text, VStack, Box } from "@chakra-ui/react";
import { Metadata } from "next/types";
import { MdArrowForward } from "react-icons/md";

export const metadata: Metadata = {
  title: "SCAUP",
};

interface InfoBoxProps {
  title: string;
  children: string;
  href: string;
}

const InfoBox = ({ title, children, href }: InfoBoxProps) => (
  <Box
    flex='1 0 0'
    as={Link}
    href={href}
    alignItems='start'
    bg='diamond.600'
    p='1em'
    position='relative'
    color='diamond.50'
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

const Home = () => (
  <main>
    <Box
      bg='diamond.700'
      alignItems='start'
      color='diamond.50'
      bgImage='/hall.png'
      bgPosition='center'
      bgRepeat='no-repeat'
      bgSize='cover'
      mx='-7.3vw'
      borderBottom='10px solid var(--chakra-colors-diamond-500)'
    >
      <VStack
        px='10vw'
        py='20vh'
        backdropFilter='blur(5px)'
        alignItems='start'
        bg='rgba(0, 5, 77, 0.7)'
      >
        <Heading>SCAUP</Heading>
        <Heading size='md' fontWeight='200'>
          Sample registration, shipping and experiment parametrisation
        </Heading>
      </VStack>
    </Box>
    <HStack mt='1em'>
      <InfoBox title='Proposals' href={`${process.env.PATO_URL}/proposals`}>
        View list of proposals
      </InfoBox>
      <InfoBox title='User Guide' href={process.env.USER_GUIDE_URL!}>
        Open detailed user guide
      </InfoBox>
      <InfoBox title='API Definition' href={`${process.env.NEXT_PUBLIC_API_URL}/docs`}>
        View API documentation
      </InfoBox>
    </HStack>
  </main>
);

export default Home;
