"use client"

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export default function SearchInput() {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const placeholders = ["Enter your rank", "Enter your name", "Enter your CET No"]

    const handleSearch = () => {
        router.push(`/counselling/?page=1&search=${search}`);
      }

  return (
    <div className="flex w-full gap-2 justify-center">
      {/* <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      className="flex items-center justify-center w-full gap-6"
      > */}
      {/* <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter your rank or name or CET No"
        className="text-center "
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      /> */}
      <PlaceholdersAndVanishInput 
      placeholders={placeholders}
      onChange={(e) => setSearch(e.target.value)}
      onSubmit={handleSearch}
      />

      <Button variant="outline" onClick={handleSearch} className="rounded-full h-15"> <SearchIcon /> </Button>
      {/* </HoverBorderGradient> */}
    </div>
  );
}
