import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user } } = await supabase.auth.getUser();

    // Public routes - accessible even when not authenticated
    const isPublicRoute = [
      "/",
      "/sign-in",
      "/sign-up",
      "/reset-password",
      "/terms",
      "/privacy",
    ].some(path => request.nextUrl.pathname.startsWith(path));

    // Auth-related routes that should only be accessible for non-authenticated users
    const isAuthRoute = [
      "/sign-in",
      "/sign-up",
      "/reset-password",
    ].some(path => request.nextUrl.pathname === path);

    // Special case for auth callback
    const isAuthCallback = request.nextUrl.pathname.startsWith("/auth/callback");

    // If user is signed in and tries to access an auth route, redirect them to dashboard
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Protected routes - require authentication
    const isProtectedRoute = [
      "/dashboard",
      "/notes",
      "/settings",
      "/profile",
    ].some(path => request.nextUrl.pathname.startsWith(path));

    // If trying to access a protected route without being authenticated
    if (isProtectedRoute && !user) {
      // Store the original URL to redirect back after login
      const redirectUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/sign-in?redirect=${redirectUrl}`, request.url));
    }

    return response;
  } catch (e) {
    console.error("Supabase middleware error:", e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
