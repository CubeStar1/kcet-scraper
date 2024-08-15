"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TableData = {
    id: string;
    cet_no: string;
    candidate_name: string;
    rank: string;
    course_name: string;
    course_code: string;
    verified_category: string;
    category_allotted: string;
    course_fee: string;
  }

export const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "cet_no",
    header: "CET No",
  },
  {
    accessorKey: "candidate_name",
    header: "Candidate Name",
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "course_name",
    header: "Course Name",
  },
  {
    accessorKey: "course_code",
    header: "Course Code",
  },
  {
    accessorKey: "verified_category",
    header: "Verified Category",
  },
  {
    accessorKey: "category_allotted",
    header: "Category Allotted",
  },
  {
    accessorKey: "course_fee",
    header: "Course Fee",
  },

]
