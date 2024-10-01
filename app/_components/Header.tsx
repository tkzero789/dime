import React from "react";
import Image from "next/image";
import Logo from "../../public/coin.svg";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="flex pt-4">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="logo" width={40} height={40} />
        <span className="font-serif text-3xl font-bold text-teal-600">
          Dime
        </span>
      </div>
      <Button asChild variant="secondary" className="ml-auto mr-4">
        <SignInButton
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
        >
          Sign in
        </SignInButton>
      </Button>
      <Button asChild>
        <SignUpButton
          forceRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
        >
          Get started
        </SignUpButton>
      </Button>
    </div>
  );
}
