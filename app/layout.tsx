import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
      <body className="font-mono antialiased min-h-screen bg-black text-green-500">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
