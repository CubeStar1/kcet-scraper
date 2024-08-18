'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Zap, Server } from "lucide-react";
import Image from 'next/image'

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

const RateLimitExplanationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Why We Implemented Stricter Rate Limiting</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Timeline of Events</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineEvent
            title="DDoS Attack"
            description="Two days ago, we experienced a Distributed Denial of Service (DDoS) attack that depleted our resources."
            icon={<Zap className="w-6 h-6" />}
          />
          <TimelineEvent
            title="Resource Depletion"
            description="The attack consumed a large portion of our edge function limit on Vercel's free tier."
            icon={<AlertCircle className="w-6 h-6" />}
          />
          <TimelineEvent
            title="Stricter Rate Limits"
            description="We implemented stricter rate limits to ensure service availability for all users."
            icon={<Clock className="w-6 h-6" />}
          />
        </CardContent>
      </Card>
    
        <Card>
        <CardContent className="flex justify-center items-center">
            <Image src="/rate-limit.png" alt="Rate Limit Explanation" width={1000} height={1000} />
        </CardContent>
        </Card>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Current Temporary Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We've had to implement stricter temporary limits to ensure service stability:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Maximum Searches:</strong> 10 per reset interval (previously 60)</li>
              <li><strong>Reset Interval:</strong> 24 hours (previously 4 hours)</li>
              <li><strong>Suggestion Reward:</strong> 2 additional searches (previously 30)</li>
            </ul>
            <Alert variant="default" className=" border-blue-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                These stricter limits are temporary measures to help us manage our resources more effectively during this period of constrained capacity.
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
            <CardTitle>Understanding Our Hosting Situation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our application is hosted on Vercel, a cloud platform for static and serverless deployment. We're currently using their free tier, which comes with certain limitations:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Limited serverless function executions</li>
              <li>Restricted bandwidth</li>
              <li>Caps on build minutes and other resources</li>
            </ul>
            <p className="mb-4">
              These limitations are reset on a monthly basis. Our next reset is expected to coincide with the KCET Round 1 or Round 2 counselling, which typically occurs in the coming weeks.
            </p>
            <Alert variant="default" className=" border-green-500">
              <Server className="h-4 w-4" />
              <AlertTitle>Looking Ahead</AlertTitle>
              <AlertDescription>
                We anticipate being able to relax these strict rate limits once our hosting plan resets, which should align with the upcoming KCET counselling rounds. This will allow us to better serve you during this critical period.
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
            <CardTitle>Why We Can't Immediately Upgrade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              While upgrading to a paid plan would allow us to relax these limits, there are financial constraints to consider:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The Vercel Pro tier, which would provide more resources, costs $20 per month to host our application.</li>
              <li>As a free service, we currently don't have a revenue stream to support this additional cost.</li>
            </ul>
            <Alert variant="default" className=" border-blue-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Until we can secure additional funding or our current plan resets next month, we must maintain these stricter limits to ensure the service remains available.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>

      

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Our Plans Moving Forward</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We're actively working on solutions to improve our service capacity:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Optimizing our code to reduce resource usage</li>
              <li>Using caching strategies to reduce the load on our database</li>
              <li>Investigating more sustainable hosting solutions such sas Cloudflare</li>
            </ul>
            <p className="mb-4">
              Our goal is to relax these strict limits as soon as it's feasible to do so without compromising the stability of our service. We'll keep you updated on any changes to these limits.
            </p>
            <p className="mb-4">
              We greatly appreciate your patience and continued support as we work through these challenges. Your understanding helps us continue to provide this service to our community.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default RateLimitExplanationPage;