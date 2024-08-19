'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Server, Mail } from "lucide-react";

const TimelineEvent = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <motion.div
    className="flex items-start mb-8"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  </motion.div>
);

const DowntimePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">KCET-Scraper Temporary Downtime</h1>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Stay Connected During Downtime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              While KCET-Scraper is temporarily unavailable, we&apos;re providing alternative ways to access data and stay updated:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Join our Discord server for access to essential data and real-time updates.</li>
              <li>Engage with our community to share insights and get support.</li>
              <li>Receive immediate notifications when the service is back online.</li>
            </ul>
            <Alert variant="default" className="border-green-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Join Our Discord Community</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span>Get access to data and stay informed during the downtime period.</span>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                  <a href="https://discord.gg/9ZqC3Mr5TK" target="_blank" rel="noopener noreferrer">Join Discord</a>
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Situation</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineEvent
            title="Resource Depletion"
            description="We&apos;ve exhausted our allocated resources on Vercel&apos;s free hosting tier."
            icon={<AlertCircle className="w-6 h-6" />}
          />
          <TimelineEvent
            title="Downtime Duration"
            description="KCET-Scraper will be unavailable for approximately 10 days."
            icon={<Clock className="w-6 h-6" />}
          />
          <TimelineEvent
            title="Service Resumption"
            description="Our hosting plan will reset next month, coinciding with KCET Round 1 or Round 2 counselling."
            icon={<Server className="w-6 h-6" />}
          />
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Why We&apos;re Experiencing Downtime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              KCET-Scraper is hosted on Vercel&apos;s free tier, which comes with certain resource limitations:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Limited serverless function executions</li>
              <li>Restricted bandwidth</li>
              <li>Caps on build minutes and other resources</li>
            </ul>
            <p className="mb-4">
              Due to high usage, we&apos;ve reached these limits earlier than anticipated. To ensure the service&apos;s availability during the critical KCET counselling period, we&apos;ve decided to pause operations until our resources reset.
            </p>
            <Alert variant="default" className="border-blue-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This downtime is temporary. We expect to resume full service in time for the KCET Round 1 or Round 2 counselling.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>What to Expect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Here&apos;s what you can expect during and after this downtime:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>KCET-Scraper will be unavailable for approximately 10 days.</li>
              <li>Service will resume automatically when our hosting plan resets.</li>
              <li>We anticipate being fully operational before KCET Round 1 or Round 2 counselling begins.</li>
              <li>You will receive an email notification when the service is back online.</li>
            </ul>
            <Alert variant="default" className="border-green-500">
              <Mail className="h-4 w-4" />
              <AlertTitle>Stay Informed</AlertTitle>
              <AlertDescription>
                We will send an email notification to all registered users as soon as KCET-Scraper is back online and ready for use.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We understand the importance of KCET-Scraper, especially during the counselling period. We want to assure you that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We&apos;re actively working on optimizing our resource usage to prevent future downtimes.</li>
              <li>We&apos;re exploring options to upgrade our hosting plan for improved reliability.</li>
              <li>Our team is committed to providing the best possible service during the critical KCET counselling rounds.</li>
            </ul>
            {/* <p className="mb-4">
              We sincerely apologize for any inconvenience this may cause and thank you for your understanding and continued support.
            </p> */}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default DowntimePage;