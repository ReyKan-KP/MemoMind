import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  // If there's an error in the callback, redirect to the sign-in page with the error
  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || "")}`, request.url)
    );
  }

  // If there's a code, attempt to exchange it for a session
  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          new URL(`/sign-in?error=session_error&error_description=${encodeURIComponent(error.message)}`, request.url)
        );
      }

      // Successfully authenticated, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (err) {
      console.error("Unexpected error during auth callback:", err);
      return NextResponse.redirect(
        new URL("/sign-in?error=unexpected_error&error_description=An+unexpected+error+occurred", request.url)
      );
    }
  }

  // If no code is provided, redirect to sign-in
  return NextResponse.redirect(new URL("/sign-in", request.url));
} 