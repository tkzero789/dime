import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dime",
  description: "Budgeting application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        layout: {
          logoImageUrl: "svg/coin.svg",
          logoLinkUrl: "/",
        },
      }}
    >
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
          {children}
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            containerStyle={{
              bottom: 28,
            }}
            toastOptions={{
              className: "border border-green-600 font-semibold text-dark",
              success: {
                style: {
                  background: "#dcfce7",
                },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
