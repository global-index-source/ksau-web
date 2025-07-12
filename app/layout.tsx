import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ksau Web - Free Cloud Storage",
  description: "Upload and store your files for free until we run out of space",
  keywords: ["cloud storage", "file upload", "onedrive", "free storage", "ksau web"],
  authors: [{ name: "Ksauraj" }],
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
