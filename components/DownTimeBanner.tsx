import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DowntimeBanner = () => {
  return (
    <Alert variant="default" className="mt-6 border-2 border-red-500 max-w-[1000px] mx-auto rounded-3xl">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Important Notice: Temporary Service Downtime</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <span className="text-sm sm:text-base">KCET-Scraper will be unavailable for approximately 10 days due to resource limitations.</span>
        <span className="text-sm sm:text-base">Join our Discord server for access to data and updates during this period.</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/downtime">Learn More</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <a href="https://discord.gg/9ZqC3Mr5TK" target="_blank" rel="noopener noreferrer">Join Discord</a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DowntimeBanner;