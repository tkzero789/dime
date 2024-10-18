import React from "react";
import Image from "next/image";
import Logo from "@/public/svg/coin.svg";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { FeaturesDropDown } from "./FeaturesDropdown";
import Link from "next/link";

export default function LandingNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-20 mx-auto mt-2 hidden w-full max-w-7xl rounded-full px-4 lg:block xl:px-0">
      <div className="nav-shadow flex rounded-full bg-white px-8 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="logo" width={40} height={40} />
          <h1 className="font-serif text-3xl font-bold text-teal-600">Dime</h1>
        </Link>
        <div className="ml-auto mr-auto flex items-center gap-2">
          <FeaturesDropDown />
          <Button
            asChild
            className="bg-transparent text-base text-dark hover:bg-transparent hover:text-medium"
          >
            <Link href="/">Pricing</Link>
          </Button>

          <Button
            asChild
            className="bg-transparent text-base text-dark hover:bg-transparent hover:text-medium"
          >
            <Link href="/">Review</Link>
          </Button>
        </div>
        <Button asChild variant="ghost" className="mr-4 text-base">
          <SignInButton
            forceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          >
            Sign in
          </SignInButton>
        </Button>
        <Button
          asChild
          className="rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-base"
        >
          <SignUpButton
            forceRedirectUrl="/dashboard"
            signInForceRedirectUrl="/dashboard"
          >
            Get started
          </SignUpButton>
        </Button>
      </div>
    </div>
  );
}
