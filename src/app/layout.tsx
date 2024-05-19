import { GoogleAnalytics } from "@next/third-parties/google";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import RecoilProvider from "@/providers/RecoilProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapStyle: Easy Paste, Edit, Share!",
  description:
    "A sleek, ad-free screenshot editor with features like direct clipboard pasting, seamless background changes, and high-quality exports, all within a user-friendly dark UI. Perfect for quick, quality image enhancements.",
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL("https://snapstyle.peerbuild.tech"),
  authors: [
    {
      name: "Priyobroto Kar",
      url: "https://x.com/priyobrotokar",
    },
    {
      name: "Ujan Ganguly",
      url: "https://linktr.ee/ujanganguly",
    },
  ],
  openGraph: {
    siteName: "SnapStyle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics gaId="G-KL8HBX29J6" />

      <body
        className={`${inter.className} overflow-hidden flex flex-col h-screen text-base`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <RecoilProvider>
            <TooltipProvider>
              <Header />
              {children}
            </TooltipProvider>
          </RecoilProvider>
          <Toaster position="bottom-left" />
        </ThemeProvider>
      </body>
    </html>
  );
}
