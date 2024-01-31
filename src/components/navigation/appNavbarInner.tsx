/* istanbul ignore file */

"use client";
import { HStack, Link, Tag, Text } from "@chakra-ui/react";
import { Breadcrumbs, Navbar, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// TODO: Move this to component library
const PhaseBanner = ({ deployType }: { deployType: "dev" | "production" | "beta" }) => {
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

export const AppNavbarInner = ({ session }: { session: null | Session }) => {
  const pathname = usePathname();

  return (
    <span className='hide-on-print' style={{ marginBottom: "0.8em" }}>
      <Navbar logo='/diamondgs.png'>
        <User
          user={
            session && session.user
              ? { fedid: session.user.email!, name: session.user.name! }
              : null
          }
          onLogin={() => signIn("diamond")}
          onLogout={() =>
            signOut({ callbackUrl: "https://authalpha.diamond.ac.uk/cas/oidc/logout" })
          }
        />
      </Navbar>
      <Breadcrumbs path={pathname} />
      <PhaseBanner deployType={process.env.NODE_ENV === "production" ? "production" : "dev"} />
    </span>
  );
};
