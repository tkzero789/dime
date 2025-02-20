import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://dimebudget.com"),
  keywords: [
    "Dime",
    "Dime AI finance assistant",
    "Dime budgeting application",
    "Dime",
    "Budgeting application",
    "AI assistant",
  ],
  title: {
    default: "Dime",
    template: `%s | Dime`,
  },
  openGraph: {
    description:
      "Budgeting AI finance assistant application for people who want to find a smarter way to manange their money",
  },
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
        <head>
          <meta
            name="apple-mobile-web-app-title"
            content="Dime Budget AI Finance Assistant"
          ></meta>
        </head>
        <body className={inter.className}>
          {children}
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            containerStyle={{
              bottom: 28,
            }}
            toastOptions={{
              className:
                "border border-green-600 font-semibold text-foreground",
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
