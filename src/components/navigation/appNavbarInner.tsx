/* istanbul ignore file */

"use client";
import { HStack, Link, Tag, Text } from "@chakra-ui/react";
import { Breadcrumbs, Navbar, NavLink, NavLinks, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NextLink from "next/link";

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
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [pathname]);

  useEffect(() => {
    setIsLoading(false);
  }, [searchParams]);

  // As for not using NextLink in breadcrumbs, https://github.com/vercel/next.js/discussions/54075
  return (
    <span className='hide-on-print' style={{ marginBottom: "0.8em" }}>
      <Navbar logo='/diamondgs.png'>
        {session && session.permissions.includes("em_admin") ? (
          <NavLinks>
            <NavLink as={NextLink} href='/inventory'>
              Inventory
            </NavLink>
          </NavLinks>
        ) : (
          <></>
        )}
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
