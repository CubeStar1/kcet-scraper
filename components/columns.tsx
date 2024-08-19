"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Rank = {
  "CET No:": string;
  "Name of the Candidate:": string;
  "Verified Category :": string;
  "Rank :": string;
  "Category allotted :": string;
  "Course allotted:": string;
  "Serial Number of the Allotted Option:": string;
}

export const columns: ColumnDef<Rank>[] = [
  {
    accessorKey: "CET No:",
    header: "CET No:",
  },
  {
    accessorKey: "Name of the Candidate:",
    header: "Name of the Candidate:",
  },
  {
    accessorKey: "Verified Category :",
    header: "Verified Category :",
  },
  {
    accessorKey: "Rank :",
    header: "Rank :",
  },
  {
    accessorKey: "Category allotted :",
    header: "Category allotted :",
  },
  {
    accessorKey: "Course allotted:",
    header: "Course allotted:",
  },
  {
    accessorKey: "Serial Number of the Allotted Option:",
    header: "Serial Number of the Allotted Option:",
    },
]
