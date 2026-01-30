import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhichBid - AI-Powered Quote Comparison",
  description: "Compare and analyze vendor quotes with AI-powered insights. Get recommendations, detect hidden costs, and make better procurement decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-brand-gray-50">
        {children}
      </body>
    </html>
  );
}
