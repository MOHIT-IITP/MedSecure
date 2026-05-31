import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedSecure — Emergency Health View",
  description: "Token-based read-only health information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
