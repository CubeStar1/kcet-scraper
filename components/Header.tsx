"use client"

import { useState } from "react";
import { ModeToggle } from "./ThemeSwitcher"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { NavigationMobile } from "@/components/NavigationMobile";





export default function Header() {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const handleSearch = () => {
        router.push(`/counselling/?page=1&search=${search}`);
      }
    return (

      
      <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm border-b ">
                    {/* <div className="hidden sm:flex items-center gap-2 ">
              <Input type="text" placeholder="Enter Rank/CET No/Name" className="flex-grow" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button size="sm" className="" onClick={handleSearch}>
                Check Allotment
              </Button>
            </div> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="ml-2 text-xl font-semibold">KCET Scraper</Link>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Navigation />
          </div>
          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <NavigationMobile />
            </div>
            <ModeToggle />
          </div>
        </nav>
      </div>
      </header>
    );
  }