import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const proxy = async (request: NextRequest) => {
  const fullHeaders = new Headers(request.headers);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const redirectUrl = request.nextUrl.pathname + "?" + request.nextUrl.searchParams.toString();
    const resp = await auth.api.signInSocial({
      body: {
        provider: "diamond",
        callbackURL: redirectUrl.toString(),
      },
      asResponse: true,
    });

    // Ungodly hack to make sure headers come through...
    return NextResponse.redirect(resp.headers.get("Location")!, { ...resp, status: undefined });
  }

  const redirectUrl = request.nextUrl.pathname + "?" + request.nextUrl.searchParams.toString();

  fullHeaders.set("x-path", redirectUrl);

  return NextResponse.next({ request: { headers: fullHeaders } });
};

export const config = {
  matcher: ["/((?!api|auth|favicon.ico|_next|_next/static|_next/image).*)"],
  unstable_allowDynamic: ["**/node_modules/@better-auth/telemetry/dist/**"],
};
