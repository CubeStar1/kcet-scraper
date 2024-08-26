'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import useUser from '../hook/useUser'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { StudentProfileSkeleton } from './components/StudentProfileSkeleton'

const supabase = createSupabaseBrowser()

type StudentData = {
    cet_no: string
    candidate_name: string
    rank: number
    course_name: string
    course_code: string
    category_allotted: string
  }

type SavedOption = {
  id: string
  courseCode: string
}

type CutoffData = {
    branch: string
    college_code: string
    college_name: string
    GM: number
    isPotential?: boolean
    [key: string]: string | number | boolean | undefined
  }

export default function StudentProfile() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [savedOptions, setSavedOptions] = useState<SavedOption[]>([])
  const [cutoffData, setCutoffData] = useState<CutoffData[]>([])
  const [cetNo, setCetNo] = useState('')
  const [studentData, setStudentData] = useState<StudentData | null>(null)


  useEffect(() => {
    if (user) {
      fetchSavedOptions()
    }
  }, [user])

  useEffect(() => {
    if (savedOptions.length > 0) {
      fetchCutoffData()
    }
  }, [savedOptions, studentData])

  const fetchStudentData = async () => {
    try {
      const res = await fetch(`/api/data/2024?search=${cetNo}`)
      if (!res.ok) throw new Error('Failed to fetch student data')
      const { data } = await res.json()
      if (data && data.length > 0) {
        setStudentData(data[0])
      } else {
        setStudentData(null)
        toast({
          title: 'No data found',
          description: 'No student data found for the given CET number.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch student data.',
        variant: 'destructive',
      })
    }
  }

  const fetchSavedOptions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('option_entry')
        .select('*')
        .order('order_num')

      if (error) throw error

      setSavedOptions(data.map(item => ({
        id: item.id,
        courseCode: item.course_code
      })))
    } catch (error) {
      console.error('Error fetching saved options:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch saved options.',
        variant: 'destructive',
      })
    }
  }
  const handleEditOptions = () => {
    router.push('/option-entry')
  }

  const fetchCutoffData = async () => {
    try {
      let allData: CutoffData[] = [];
      for (const option of savedOptions) {
        const res = await fetch(`/api/cutoffs?course=${option.courseCode}&categories=GM&year=2024&round=Mock 1`);
        if (!res.ok) throw new Error(`Failed to fetch cutoff data for ${option.courseCode}`);
        const data = await res.json();
        allData = [...allData, ...data];
      }
      
      // Highlight potential branches
      if (studentData) {
        allData = allData.map(cutoff => ({
          ...cutoff,
          isPotential: cutoff.GM >= studentData.rank
        }));
      }
      
      setCutoffData(allData);
      console.log('Cutoff data with isPotential:', allData);
    } catch (error) {
      console.error('Error fetching cutoff data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cutoff data.',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<CutoffData>[] = [
    {
      accessorKey: "college_code",
      header: "College Code",
    },
    {
      accessorKey: "college_name",
      header: "College Name",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "GM",
      header: "GM Cutoff",
      cell: ({ row }) => {
        const isPotential = row.original.isPotential;
        return (
          <div className={isPotential ? "font-bold text-green-600 bg-green-100 p-1 rounded" : ""}>
            {row.getValue("GM")}
          </div>
        );
      },
    },
  ];


  if (isUserLoading) {
    return <StudentProfileSkeleton />;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Student Profile</h1>

      <Card>
      <CardHeader>
        <CardTitle>Enter Your CET Number</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={cetNo}
            onChange={(e) => setCetNo(e.target.value)}
            placeholder="Enter CET Number"
          />
          <Button onClick={fetchStudentData}>Fetch Data</Button>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentData && (
        <Card>
            <CardHeader>
            <CardTitle>Your CET Results</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-2">
                <p><strong>Name:</strong> {studentData.candidate_name}</p>
                <p><strong>CET Number:</strong> {studentData.cet_no}</p>
                <p><strong>Rank:</strong> {studentData.rank}</p>
                <p><strong>Allotted Course:</strong> {studentData.course_name} ({studentData.course_code})</p>
                <p><strong>Category Allotted:</strong> {studentData.category_allotted}</p>
            </div>
            </CardContent>
        </Card>
        )}
    
        <Card>
            <CardHeader>
            <CardTitle>Your Saved Options</CardTitle>
            </CardHeader>
            <CardContent>
            <ul className="space-y-2">
                {savedOptions.map((option, index) => (
                <li key={option.id} className="bg-secondary p-3 rounded-md">
                    <span className="font-semibold">{index + 1}. {option.courseCode}</span>
                </li>
                ))}
            </ul>
            <Button onClick={handleEditOptions} className="my-4 w-full">Edit Your Options</Button>
            </CardContent>
        </Card>
    
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Cutoffs for Your Options</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={cutoffData} />
        </CardContent>
      </Card>
    </div>
  )
}