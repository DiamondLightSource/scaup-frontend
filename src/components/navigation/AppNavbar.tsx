import { authOptions } from "@/mappings/authOptions";
import { getServerSession } from "next-auth/next";
import { AppNavbarInner } from "./AppNavbarInner";
import { HStack, Link, Tag, Text } from "@chakra-ui/react";

type DeployType = "dev" | "production" | "beta";

const PhaseBanner = ({ deployType }: { deployType: DeployType }) => {
  if (deployType === "production") {
    return null;
  }

  return (
    <HStack
      mt='0.8em'
      mx='7.3vw'
      borderBottom='1px solid var(--chakra-colors-diamond-100)'
      py='0.2em'
    >
      <Tag
        fontWeight='600'
        bg={deployType === "dev" ? "purple" : "diamond.700"}
        color='diamond.50'
        borderRadius='0'
      >
        {deployType.toUpperCase()}
      </Tag>
      <Text>
        This version of the service is still in testing, report any issues to the{" "}
        <Link color='diamond.700' href={"mailto:" + process.env.NEXT_PUBLIC_DEV_CONTACT}>
          developers.
        </Link>
      </Text>
    </HStack>
  );
};

export const AppNavbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <span className='hide-on-print' style={{ marginBottom: "0.3em" }}>
      <AppNavbarInner session={session} />
      <PhaseBanner deployType={process.env.DEPLOY_TYPE as DeployType} />
    </span>
  );
};
