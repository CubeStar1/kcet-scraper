import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchInput from "@/components/SearchInput"
import { HeroScrollDemo } from "@/components/HeroScroll"

const Page = () => {
  return (
    <div className="relative max-h-[calc(100vh-12rem)] ">
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="relative container mx-auto px-8 py-16 flex flex-col items-center justify-center text-center z-10 gap-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          KEA KCET Counselling Insights
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Explore ranks and college allotments from the latest KCET counselling data
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-10">
          <SearchInput />
        </div>
        <HeroScrollDemo />
      </div>
    </div>
  )
}

export default Page