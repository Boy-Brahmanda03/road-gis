"use client";

import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const noNavbarPaths = ["/login", "/register"];
  return (
    <html lang="en">
      <head>
        <title>Road</title>
      </head>
      <body className={inter.className}>
        {!noNavbarPaths.includes(pathname) && <Navbar />}
        <div>{children}</div>
      </body>
    </html>
  );
}
