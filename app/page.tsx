"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchInput from "@/components/SearchInput"
import { HeroScrollDemo } from "@/components/HeroScroll"
import { Spotlight } from '@/components/ui/spotlight'

const Page = () => {
  return (
    <div>
      <div className="relative max-h-[calc(100vh-12rem)] ">
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="relative container mx-auto px-8 py-16 flex flex-col items-center justify-center text-center z-10 gap-14">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            KEA KCET Counselling Insights
          </h1>
          <p className="text-xl font-bold md:text-2xl mb-8 max-w-2xl ">
            View ranks and college allotments from the latest KCET counselling results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md ">
            <SearchInput />
          </div>
          <p className="text-sm md:text-sm mb-8 max-w-2xl text-gray-400">
            Last Scraped: 2024-08-15 at 12:00 PM
          </p>
        </div>
      </div>
      <HeroScrollDemo />
    </div>
  )
}

export default Page