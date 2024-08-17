"use client"

import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CET No" />
    ),
  },
  {
    accessorKey: "candidate_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "rank",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank" />
    ),
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
