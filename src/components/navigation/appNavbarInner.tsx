/* istanbul ignore file */

"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Navbar, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Breadcrumbs = ({ pathname }: { pathname: string }) => {
  const pathCrumbs = pathname.split("/").filter((name) => name !== "");

  if (pathCrumbs.length === 0) return null;

  const currentPage = pathCrumbs.pop();
  let partialPath: Array<string> = Array(pathCrumbs.length + 1).fill(".");

  return (
    <Breadcrumb
      bg='diamond.700'
      w='100%'
      color='diamond.50'
      fontSize='0.9em'
      py='0.2em'
      px='7.6vw'
      id='breadcrumbs'
      separator='>'
    >
      <BreadcrumbItem>
        <BreadcrumbLink _hover={{ opacity: "0.6" }} aria-label='Home' href='/'>
          HOME
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathCrumbs.map((pathname, i) => {
        partialPath.pop();
        return (
          <BreadcrumbItem key={pathname}>
            <BreadcrumbLink href={"/" + pathCrumbs.slice(0, i + 1).join("/")}>
              {pathname}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
      <BreadcrumbItem color='diamond.500'>
        <BreadcrumbLink color='diamond.500' isCurrentPage key={currentPage}>
          {currentPage}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export const AppNavbarInner = ({ session }: { session: null | Session }) => {
  const pathname = usePathname();

  return (
    <>
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
      <Breadcrumbs pathname={pathname} />
    </>
  );
};
