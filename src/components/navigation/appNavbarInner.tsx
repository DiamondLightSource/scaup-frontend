"use client";
import { HStack, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { Navbar, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export const AppNavbarInner = ({ session }: { session: null | Session }) => (
  <Navbar>
    {session === undefined ? (
      <HStack h='100%'>
        <SkeletonText noOfLines={2} spacing='2' skeletonHeight='2' w='50px' />
        <SkeletonCircle />
      </HStack>
    ) : (
      <User
        user={
          session && session.user ? { fedid: session.user.email!, name: session.user.name! } : null
        }
        onLogin={() => signIn("diamond")}
        onLogout={() => signOut({ callbackUrl: "https://authalpha.diamond.ac.uk/cas/oidc/logout" })}
      />
    )}
  </Navbar>
);
