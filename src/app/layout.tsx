import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const heading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "LuxeCart | Custom Ecommerce Website",
    template: "%s | LuxeCart",
  },
  description: "A full custom ecommerce storefront and admin dashboard with PayHere integration for Sri Lanka.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} bg-[#07111f] text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
