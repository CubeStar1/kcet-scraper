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
import { ArrowUpDown } from "lucide-react"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CutoffData = {
    branch: string;
    '1G': number;
    '1K': number;
    '1R': number;
    '2AG'?: number;
    '2AK'?: number;
    '2AR'?: number;
    '2BG'?: number;
    '2BK'?: number;
    '2BR'?: number;
    '3AG'?: number;
    '3AK'?: number;
    '3AR'?: number;
    '3BG'?: number;
    '3BK'?: number;
    '3BR'?: number;
    'GM': number;
    'GMK'?: number;
    'GMR'?: number;
    'SCG'?: number;
    'SCK'?: number;
    'SCR'?: number;
    'STG'?: number;
    'STK'?: number;
    'STR'?: number;
    college_code: string;
    college_name: string;
    [key: string]: string | number | undefined;
}
  

export const columns: ColumnDef<CutoffData>[] = [
  {
    accessorKey: "branch",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Branch
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "1G",
    header: "1G",
  },
  {
    accessorKey: "1K",
    header: "1K",
  },
  {
    accessorKey: "1R",
    header: "1R",
  },
  {
    accessorKey: "2AG",
    header: "2AG",
  },
  {
    accessorKey: "2AK",
    header: "2AK",
  },
  {
    accessorKey: "2AR",
    header: "2AR",
  },

  {
    accessorKey: "2BG",
    header: "2BG",
  },
  {
    accessorKey: "2BK",
    header: "2BK",
  },
  {
    accessorKey: "2BR",
    header: "2BR",
  },
  {
    accessorKey: "3AG",
    header: "3AG",
  },
  {
    accessorKey: "3AK",
    header: "3AK",
  },
  {
    accessorKey: "3AR",
    header: "3AR",
  },
  {
    accessorKey: "3BG",
    header: "3BG",
  },
  {
    accessorKey: "3BK",
    header: "3BK",
  },
  {
    accessorKey: "3BR",
    header: "3BR",
  },
  {
    accessorKey: "GM",
    header: "GM",
  },
  {
    accessorKey: "GMK",
    header: "GMK",
  },
  {
    accessorKey: "GMR",
    header: "GMR",
  },
  {
    accessorKey: "SCG",
    header: "SCG",
  },
  {
    accessorKey: "SCK",
    header: "SCK",
  },
  {
    accessorKey: "SCR",
    header: "SCR",
  },
  {
    accessorKey: "STG",
    header: "STG",
  },
  {
    accessorKey: "STK",
    header: "STK",
  },
  {
    accessorKey: "STR",
    header: "STR",
  },
  {
    accessorKey: "college_code",
    header: "College Code",
  },
  {
    accessorKey: "college_name",
    header: "College Name",
  },
]
