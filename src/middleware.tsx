import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";

export const middleware = async (request: NextRequest) => {
  const fullHeaders = new Headers(request.headers);

  fullHeaders.set("x-path", request.nextUrl.pathname);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "diamond",
        callbackURL: request.nextUrl.pathname,
      },
    });

    return NextResponse.redirect(url!);
  }

  return NextResponse.next({ request: { headers: fullHeaders } });
};

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image).*)"],
};
