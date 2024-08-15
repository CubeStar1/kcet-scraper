"use client"

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchInput() {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const placeholders = ["Enter your rank", "Enter your name", "Enter your CET No"]
    const [year, setYear] = useState("2024")

    const handleSearch = () => {
        router.push(`/counselling/${year}?page=1&search=${search}`);
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
      <Select
        value={year}
        onValueChange={setYear}
      >
        <SelectTrigger className="w-20 h-18 rounded-full">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleSearch} className="rounded-full h-15"> <SearchIcon /> </Button>
      {/* </HoverBorderGradient> */}
    </div>
  );
}
