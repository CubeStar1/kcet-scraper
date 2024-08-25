'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import { Column, ColumnDef } from "@tanstack/react-table";
import TableSkeleton from '@/app/cutoffs/components/TableSkeleton';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { collegeCodes, colleges, CutoffData, categoryOptions } from '@/lib/colleges';
import { ArrowUpDown } from 'lucide-react';

const rounds = ['Mock 1','Round 1', 'Round 2', 'Round 3']

async function getCutoffData(filters: any) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`/api/cutoffs?${params}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}


export default function Component() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['GM']);
  const [selectedRounds, setSelectedRounds] = useState(['Mock 1']);
  const [cutoffData, setCutoffData] = useState<CutoffData[]>([]);
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState('All');
  const [course, setCourse] = useState('All');
  const [kcetRank, setKcetRank] = useState('');
  const [showNewCourses, setShowNewCourses] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');

  const columns = useMemo(() => {
    const baseColumns: ColumnDef<CutoffData>[] = [
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
    ];

    const categoryColumns = selectedCategories.map(category => ({
      accessorKey: category,
      header: ({ column }: { column: Column<CutoffData> }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
             {`${category} Cutoff`}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      }
    }));

    return [...baseColumns, ...categoryColumns];
  }, [selectedCategories]);

  const fetchCutoffData = async () => {
    setLoading(true);
    try {
      const filters = {
        college,
        course,
        categories: selectedCategories.join(','),
        kcetRank,
        round: selectedRounds,
        search: searchTerm,
        year: selectedYear
      };
      const data = await getCutoffData(filters);
      setCutoffData(data);
    } catch (error) {
      console.error('Error fetching cutoff data:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleApplyFilters = () => {
    fetchCutoffData();
  };
  const handleRoundChange = (round: string) => {
    setSelectedRounds(prev => 
      prev.includes(round) ? prev.filter(r => r !== round) : [...prev, round]
    )
  }

  const memoizedFetchCutoffData = useMemo(() => {
    return () => {
      fetchCutoffData();
    };
  }, [fetchCutoffData]);

  useEffect(() => {
    memoizedFetchCutoffData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">College Cutoff Search</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">


        <div className="space-y-2">
            <Label>Select year and rounds</Label>
            <div className="flex flex-wrap flex-col w-full gap-4 items-center sm:flex-row sm:items-start justify-start">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {['2024', '2023', '2022', '2021', '2020', '2019'].map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-between w-full">
              {rounds.map(round => (
                <div key={round} className="flex items-center space-x-2">
                  <Checkbox 
                    id={round} 
                    checked={selectedRounds.includes(round)}
                    onCheckedChange={() => handleRoundChange(round)}
                  />
                  <label htmlFor={round} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {round}
                  </label>
                </div>
              ))}
              </div>
            </div> 
          </div> 

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Select value={college} onValueChange={setCollege}>
              <SelectTrigger>
                <SelectValue placeholder="College - All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Colleges</SelectItem>
                {colleges.map(college => (
                  <SelectItem value={college}>{college}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Course - All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Courses</SelectItem>
                {collegeCodes.map( (code) =>
                (
                  <SelectItem value={code}>{code}</SelectItem>
                )
                )
              }
              </SelectContent>
            </Select>

            <Input 
              type="number" 
              placeholder="KCET Rank" 
              value={kcetRank} 
              onChange={(e) => setKcetRank(e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Select Categories to Display</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {categoryOptions.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={selectedCategories.includes(category.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.value]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category.value));
                      }
                    }}
                  />
                  <Label htmlFor={`category-${category.value}`}>{category.label}</Label>
                </div>
              ))}
            </div>
          </div>

          

          <div className="flex flex-col justify-between mb-4 sm:flex-row gap-4">
            <Input
              placeholder="Search by college name, course..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-full"
            />
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cutoff Results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : (
            <>
              <DataTable columns={columns} data={cutoffData} />
              <div className="mt-4 flex justify-end">
                <p>Total Results: {cutoffData.length}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}