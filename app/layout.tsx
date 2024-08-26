import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "sonner";
import QueryProvider from "@/components/query-provider";
import QueryClientProvider from "@/components/query-provider";
import DowntimeBanner from "@/components/DownTimeBanner";

import Script from "next/script";

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
        <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />
          {/* <DowntimeBanner /> */}
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
          <Toaster />
          <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script> 
        </ThemeProvider>
        </QueryProvider>
        
      </body>
    </html>
  );
}
