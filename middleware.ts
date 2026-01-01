import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/privacy-policy",
  "/terms-of-service",
  "/sitemap.xml",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/budgets(.*)",
  "/income(.*)",
  "/penny(.*)",
  "/recurring(.*)",
  "/saving(.*)",
  "/spending(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
