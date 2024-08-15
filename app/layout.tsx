import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KCET Scraper",
  description: "KCET Scraper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />
          <NextTopLoader
           color="#2299DD"
           initialPosition={0.08}
           crawlSpeed={200}
           height={3}
           crawl={true}
           showSpinner={false}
           easing="ease"
           speed={200}
           shadow="0 0 10px #2299DD,0 0 5px #2299DD"
           />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
