import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dime",
  description: "Budgeting AI Finance Assistant Application",
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
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="description"
            content="Dime is a budgeting application that helps you manage your finances and interact with an AI Assistant for insights and tips."
          />
          <meta
            name="keywords"
            content="budgeting, finance, AI Assistant, money management, income, transactions"
          />
          <meta name="author" content="Thinh Tran" />
          <meta
            property="og:title"
            content="Dime - Budgeting AI Finance Assistant Application"
          />
          <meta
            property="og:description"
            content="Dime is a budgeting application that helps you manage your finances and interact with an AI Assistant for insights and tips."
          />
          <meta property="og:url" content="https://dime-mu.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://dime-mu.vercel.app/img/budget2.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Dime - Budgeting Application" />
          <meta
            name="twitter:description"
            content="Dime is a budgeting application that helps you manage your finances and interact with an AI Assistant for insights and tips."
          />
          <meta
            name="twitter:image"
            content="https://dime-mu.vercel.app/img/budget2.png"
          />
          <link rel="icon" href="/favicon.ico" />
          <title>Dime</title>
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
