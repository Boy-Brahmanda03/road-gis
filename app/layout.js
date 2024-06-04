import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Discover Roads</title>
        <link rel="icon" href="../public/icon.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
