import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";


const RateLimitBanner = () => {
  return (
    <Alert variant="default" className="mt-6 border-2 border-blue-500 max-w-[1000px] mx-auto rounded-3xl">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Important Notice: Rate Limiting in Effect</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <span className="text-sm sm:text-base">We've implemented stricter rate limits due to recent events. This may affect your usage.</span>
        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
          <Link href="/rate-limits">Learn More</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default RateLimitBanner;