import Link from "next/link";
import React from "react";
import Logo from "@/public/svg/coin.svg";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="mx-auto mt-40 w-full max-w-7xl px-4">
      <div className="grid grid-cols-5 gap-y-8 pb-12">
        <div className="col-span-5 flex flex-col gap-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="logo" width={40} height={40} />
            <h1 className="font-serif text-3xl font-bold text-teal-600">
              Dime
            </h1>
          </Link>
          <p className="w-full text-sm text-secondary-foreground md:w-4/5">
            Track your spending, plan your savings, and gain control over your
            finances with ease.
          </p>
        </div>
        <div className="col-span-5 flex flex-col gap-4 md:col-span-1">
          <span className="font-bold text-secondary-foreground">About</span>
          <ul className="flex flex-col gap-3 text-sm font-light text-secondary-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Features
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-5 flex flex-col gap-4 md:col-span-1">
          <span className="font-bold text-secondary-foreground">Product</span>
          <ul className="flex flex-col gap-3 text-sm font-light text-secondary-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground">
                Features
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-5 flex flex-col gap-4 md:col-span-1">
          <span className="font-bold text-secondary-foreground">Resources</span>
          <ul className="flex flex-col gap-3 text-sm font-light text-secondary-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-foreground">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center">
        <span className="text-sm font-light text-secondary-foreground">
          © 2024 Dime. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
