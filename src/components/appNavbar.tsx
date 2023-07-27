"use client";
import { HStack, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { Navbar, User } from "diamond-components";
import { signIn, signOut, useSession } from "next-auth/react";

export const AppNavbar = () => {
  const { data } = useSession();

  return (
    <Navbar>
      {data === undefined ? (
        <HStack h='100%'>
          <SkeletonText noOfLines={2} spacing='2' skeletonHeight='2' w='50px' />
          <SkeletonCircle />
        </HStack>
      ) : (
        <User
          user={data && data.user ? { fedid: data.user.email!, name: data.user.name! } : null}
          onLogin={() => signIn("diamond")}
          onLogout={() => signOut()}
        />
      )}
    </Navbar>
  );
};
