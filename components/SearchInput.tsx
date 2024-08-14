"use client"

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";


export default function SearchInput() {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        router.push(`/counselling/?page=1&search=${search}`);
      }

  return (
    <div className="flex w-full gap-2">
    <Input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Enter your rank or name or CET No"
      className="text-center"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      }}
    />
    <Button variant="outline" onClick={handleSearch}> <SearchIcon /> </Button>
    </div>
  );
}
