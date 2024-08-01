import React from "react";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="flex pt-4">
      <Image src={Logo} alt="logo" width={60} height={60} />
      <Button asChild variant="outline" className="ml-auto mr-4">
        <SignInButton
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
        />
      </Button>
      <Button asChild>
        <SignUpButton
          forceRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
        />
      </Button>
    </div>
  );
}
