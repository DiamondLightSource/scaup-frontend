import { HStack, Spacer, Text } from "@chakra-ui/react";

export const Footer = () => (
  <HStack w='100%' bg='diamond.800' className='hide-on-print' color='white' px='7.3em' py='0.5em'>
    <Text>Scaup</Text>
    <Spacer />
    <Text>{process.env.NEXT_PUBLIC_APP_VERSION}</Text>
  </HStack>
);
