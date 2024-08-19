'use client'

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

export type CutoffData = {
    'branch': string;
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
const categoryOptions = [
  { value: 'GM', label: 'GM' },
  { value: '1G', label: '1G' },
  { value: '2AG', label: '2AG' },
  { value: '2BG', label: '2BG' },
  { value: '3AG', label: '3AG' },
  { value: '3BG', label: '3BG' },
  { value: 'SCG', label: 'SCG' },
  { value: 'STG', label: 'STG' },
  { value: 'GMK', label: 'GMK' },
  { value: 'GMR', label: 'GMR' },
  { value: 'SCK', label: 'SCK' },
  { value: 'SCR', label: 'SCR' },
  { value: 'STR', label: 'STR' },
  { value: '1K', label: '1K' },
  { value: '1R', label: '1R' },
  { value: '2AK', label: '2AK' },
  { value: '2AR', label: '2AR' },
  { value: '3AK', label: '3AK' },
  { value: '3AR', label: '3AR' },
  { value: '2BK', label: '2BK' },
  { value: '2BR', label: '2BR' },
  { value: '3BK', label: '3BK' },
  { value: '3BR', label: '3BR' },
  { value: 'STK', label: 'STK' },
];

async function getCutoffData(filters: any) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`/api/cutoffs?${params}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default function CutoffPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['GM']);
  const [selectedRound, setSelectedRound] = useState('Round 1');
  const [showDetails, setShowDetails] = useState('RK');
  const [cutoffData, setCutoffData] = useState<CutoffData[]>([]);
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState('All');
  const [course, setCourse] = useState('All');
  const [district, setDistrict] = useState('All');
  const [kcetRank, setKcetRank] = useState('');
  const [showNewCourses, setShowNewCourses] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      header: `${category} Cutoff`,
    }));

    return [...baseColumns, ...categoryColumns];
  }, [selectedCategories]);

  const fetchCutoffData = async () => {
    setLoading(true);
    try {
      const filters = {
        college,
        course,
        district,
        categories: selectedCategories.join(','),
        kcetRank,
        round: selectedRound,
        showNewCourses: showNewCourses.toString(),
        search: searchTerm
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">College Cutoff Search</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            <Label>Show the details for</Label>
            <RadioGroup defaultValue="RK" onValueChange={setShowDetails} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RK" id="RK" />
                <Label htmlFor="RK">RK</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HK" id="HK" />
                <Label htmlFor="HK">HK</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Select value={college} onValueChange={setCollege}>
              <SelectTrigger>
                <SelectValue placeholder="College - All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Colleges</SelectItem>
                {/* Add college options dynamically */}
              </SelectContent>
            </Select>

            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Course - All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Courses</SelectItem>
                {/* Add course options dynamically */}
              </SelectContent>
            </Select>

            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="District - All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Districts</SelectItem>
                {/* Add district options dynamically */}
              </SelectContent>
            </Select>

            <Input 
              type="number" 
              placeholder="KCET Rank" 
              value={kcetRank} 
              onChange={(e) => setKcetRank(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Categories to Display</Label>
            <div className="flex flex-wrap gap-2">
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

          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
              <Label>Filter based on 2023 Cutoffs</Label>
              <RadioGroup defaultValue="Round 1" onValueChange={setSelectedRound} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Round 1" id="round1" />
                  <Label htmlFor="round1">Round 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Round 2" id="round2" />
                  <Label htmlFor="round2">Round 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ext. Round" id="extRound" />
                  <Label htmlFor="extRound">Ext. Round</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mock Round Cutoff-24" id="mockRound" />
                  <Label htmlFor="mockRound">Mock Round Cutoff-24</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="newCourses" 
                checked={showNewCourses}
                onCheckedChange={(checked) => setShowNewCourses(checked as boolean)}
              />
              <Label htmlFor="newCourses">Show ONLY new courses in 2024</Label>
            </div>
          </div>

          <div className="flex flex-col justify-between mb-4 sm:flex-row">
            <Input
              placeholder="Search by college name, course..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-lg"
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
            <p>Loading cutoff data...</p>
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