import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { DynamicTitle } from "@/components/ui/dynamic-title";
import { DynamicFavicon } from "@/components/ui/dynamic-favicon";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Occasio",
  description: "Every Occasion, Perfectly Planned. Your all-in-one event management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="snap-y snap-mandatory scroll-smooth" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <DynamicFavicon />
          <DynamicTitle />
        {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
