import { components } from "@/types/schema";
import { serverFetch } from "@/utils/server/request";
import { formatDate } from "@/utils/generic";
import {
  Heading,
  HStack,
  VStack,
  Box,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Divider,
  Button,
} from "@chakra-ui/react";
import { Metadata } from "next/types";
import NextLink from "next/link";
import { InfoBox } from "@/components/navigation/InfoCard";

export const metadata: Metadata = {
  title: "SCAUP",
};

const getSessions = async () => {
  const currentDate = new Date();
  const response = await serverFetch(`/sessions?limit=4&minEndDate=${currentDate.toISOString()}`);

  if (response.status !== 200) {
    return null;
  }

  const sessions: components["schemas"]["Paged_SessionOut_"] = await response.json();
  return await Promise.all(
    sessions.items.map(async (session) => {
      if (session.visitNumber === undefined) {
        return { session, shipmentCount: 0 };
      }

      const response = await serverFetch(
        `/proposals/${session.parentProposal}/sessions/${session.visitNumber}/shipments?limit=1`,
      );

      if (response.status !== 200) {
        return { session, shipmentCount: 0 };
      }

      const shipmentsResponse: components["schemas"]["Paged_ShipmentOut_"] = await response.json();

      return { session, shipmentCount: shipmentsResponse.total };
    }),
  );
};

const Home = async () => {
  const sessions = await getSessions();

  return (
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
        <HStack bg='rgba(0, 5, 77, 0.7)' px='5vw' backdropFilter='blur(5px)' py='15vh'>
          <VStack flex='1 0 0' alignItems='start'>
            <Heading>SCAUP</Heading>
            <Heading size='md' fontWeight='200'>
              <b>S</b>ample <b>C</b>onsignment <b>A</b>nd <b>U</b>ser experiment <b>P</b>
              arametrisation
            </Heading>
          </VStack>
          <HStack>
            <InfoBox title='Proposals' href={`${process.env.PATO_URL}/proposals`}>
              View list of proposals
            </InfoBox>
            <InfoBox title='User Guide' href={process.env.USER_GUIDE_URL ?? "#"}>
              Open detailed user guide
            </InfoBox>
          </HStack>
        </HStack>
      </Box>
      <Heading textAlign='left' w='100%' size='lg' mt='1em'>
        Current Sessions
      </Heading>
      <Divider borderColor='diamond.300' />
      <HStack my='1em' flexWrap='wrap'>
        {sessions ? (
          sessions.map((item) => (
            <Stat
              key={item.session.sessionId}
              _hover={{
                borderColor: "diamond.400",
              }}
              bg='diamond.50'
              overflow='hidden'
              p={2}
              flex='1 0 0'
              minW='180px'
              border='1px solid grey'
              borderRadius={5}
            >
              <StatLabel whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                {item.session.beamLineOperator ? item.session.beamLineOperator.join(", ") : "?"}
              </StatLabel>
              <StatNumber>
                {item.session.parentProposal}-{item.session.visitNumber ?? "?"}
              </StatNumber>
              <StatHelpText mb='0'>
                <b>Start: </b>
                {formatDate(item.session.startDate)}
              </StatHelpText>
              <StatHelpText mb='0'>
                <b>End: </b>
                {formatDate(item.session.endDate)}
              </StatHelpText>
              <StatHelpText>
                <b>Sample Collections: </b>
                {item.shipmentCount}
              </StatHelpText>
              <HStack flexWrap='wrap'>
                <NextLink
                  href={`/proposals/${item.session.parentProposal}/sessions/${item.session.visitNumber}/shipments`}
                >
                  <Button size='xs' minW='160px' flex='1 0 0'>
                    View session overview
                  </Button>
                </NextLink>
                <NextLink href={`/proposals/${item.session.parentProposal}/shipments`}>
                  <Button size='xs' minW='160px' flex='1 0 0'>
                    View proposal overview
                  </Button>
                </NextLink>
              </HStack>
            </Stat>
          ))
        ) : (
          <Heading variant='notFound' w='100%'>
            No sessions available
          </Heading>
        )}
      </HStack>
    </main>
  );
};

export default Home;
