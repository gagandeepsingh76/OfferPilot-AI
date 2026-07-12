import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OfferPilot AI | Make smarter career decisions",
  description: "Upload and analyze job offers, compare compensation packages, receive AI-powered negotiation advice, and manage multiple opportunities in one workspace.",
  keywords: ["salary negotiation", "job offer comparison", "career advice", "tech compensation"],
  authors: [{ name: "OfferPilot AI" }],
  openGraph: {
    title: "OfferPilot AI | Make smarter career decisions",
    description: "Upload and analyze job offers, compare compensation packages, receive AI-powered negotiation advice, and manage multiple opportunities in one workspace.",
    url: "https://offerpilot.ai",
    siteName: "OfferPilot AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OfferPilot AI",
    description: "Make smarter career decisions with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
