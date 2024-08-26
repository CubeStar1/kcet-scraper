"use client"

import React from 'react'
import Link from 'next/link'
import SearchInput from "@/components/SearchInput"
import { Spotlight } from '@/components/ui/spotlight'
import { BentoGridDemo } from '@/components/BentoGridDemo'
import { HeroScrollDemo } from '@/components/HeroScroll'
import { Card } from '@/components/ui/card'

const Page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="grid grid-cols-1 lg:grid-cols-2 px-6">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="relative container mx-auto px-8 py-20 flex flex-col items-center justify-center text-center z-10 gap-8 lg:text-left lg:items-start">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
           
          />
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            KEA KCET Counselling Insights
          </h1>
          <p className="text-xl font-bold md:text-2xl mb-8 max-w-2xl">
            View ranks and college allotments from the latest KCET counselling results
          </p>
          <div className="w-full max-w-md mb-8">
            <SearchInput />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* <Link href="/cutoffs" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Cutoffs
            </Link>
            <Link href="/student-profile" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Dashboard
            </Link> */}
            <Link href="/counselling/2024" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Counselling
            </Link>
            {/* <Link href="/chat" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Chatroom
            </Link> */}
          </div>
        </div>
      </div>
      <div>
        <HeroScrollDemo/>
      </div>
      </div>
      
      {/* Features Grid */}
      <div className="container mx-auto px-8 py-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Features</h2>
        <BentoGridDemo />
      </div>
      
      {/* CTA Section */}
      <Card className="mb-6 flex justify-center items-center max-w-lg mx-auto">
        <div className="py-8">
          <div className="container mx-auto px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Sign Up Now to get started</h2>
            <Link href="/register" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Sign Up 
            </Link>
            <p className="text-sm text-muted-foreground pt-6">
              Already have an account? <Link href="/signin" className="text-primary hover:underline ">Login</Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Page