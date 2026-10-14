import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Scholarship Hub - Global Scholarships, Grants & Fellowships",
    template: "%s | Scholarship Hub",
  },
  description:
    "Discover fully funded and partial scholarships, grants and fellowships for Bachelor, Master, PhD and postdoctoral study worldwide.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
