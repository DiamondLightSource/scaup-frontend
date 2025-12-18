"use client";
import { Breadcrumbs, Navbar, NavLink, NavLinks, User } from "@diamondlightsource/ui-components";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { signIn, signOut } from "@/utils/client/auth";

export const AppNavbarInner = ({
  session,
}: {
  session: { permissions: string[]; id: string; name: string } | null;
}) => {
  const pathname = usePathname();

  // As for not using NextLink in breadcrumbs, https://github.com/vercel/next.js/discussions/54075
  return (
    <>
      <Navbar logo='/diamondgs.png'>
        {session && session.permissions.includes("em_admin") ? (
          <NavLinks>
            <NextLink href='/inventory'>
              <NavLink>Inventory</NavLink>
            </NextLink>
          </NavLinks>
        ) : (
          <></>
        )}
        <User
          user={session ? { fedid: session.id, name: session.name } : null}
          onLogin={() => signIn.social({ provider: "diamond" })}
          onLogout={signOut}
        />
      </Navbar>
      <Breadcrumbs path={pathname} />
    </>
  );
};
