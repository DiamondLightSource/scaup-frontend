import { NextRequest, NextResponse } from "next/server";
import { auth, refreshToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const middleware = async (request: NextRequest) => {
  const fullHeaders = new Headers(request.headers);
  const requestCookies = await cookies();

  if (!requestCookies.get(process.env.OAUTH_COOKIE_NAME!)?.value) {
    const session = await auth.api.getSession({
      headers: fullHeaders,
    });

    if (session?.user.refreshToken) {
      const newToken = await refreshToken(session.user.refreshToken);
      if (newToken) {
        // Set cookie in frontend and return user to the page they were in before
        return NextResponse.redirect(request.nextUrl, {
          headers: {
            "set-cookie": `${process.env.OAUTH_COOKIE_NAME}=${newToken};path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=250`,
          },
        });
      }
    }

    const redirectUrl = request.nextUrl.pathname + "?" + request.nextUrl.searchParams.toString();
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "diamond",
        callbackURL: redirectUrl,
      },
    });

    return NextResponse.redirect(url!);
  }

  const redirectUrl = request.nextUrl.pathname + "?" + request.nextUrl.searchParams.toString();

  fullHeaders.set("x-path", redirectUrl);

  return NextResponse.next({ request: { headers: fullHeaders } });
};

export const config = {
  matcher: ["/((?!api|auth|favicon.ico|_next|_next/static|_next/image).*)"],
};
