import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  fallback: ["Helvetica Neue", "Arial"],
});

export const metadata: Metadata = {
  title: "AFFIN BANK Onboarding",
  description: "AFFIN BANK Onboarding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
