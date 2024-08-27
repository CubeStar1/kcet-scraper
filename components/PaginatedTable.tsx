"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchForm from './SearchForm';
import { useToast } from "@/components/ui/use-toast";
import useUser from '@/app/hook/useUser'; 
import { formatDistanceToNow } from 'date-fns'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableSkeleton from './TableSkeleton';

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
  serial_number_allotted_option: string;
  stream: string;
}

const PaginatedTable = ({ initialYear, initialRound }: { initialYear: string, initialRound: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<TableData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeSearchTerm, setActiveSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState(100);
  const [error, setError] = useState('');
  const [nextResetTime, setNextResetTime] = useState<Date | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedRound, setSelectedRound] = useState(initialRound);
  const [selectedStream, setSelectedStream] = useState(searchParams.get('stream') || 'All Streams');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedCourseCode, setSelectedCourseCode] = useState(searchParams.get('courseCode') || '');

  const { toast } = useToast();
  const { data: user } = useUser();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchDataAndCheckLimit = useCallback(async (page: number, search: string, courseCode: string, category: string, stream: string, append: boolean = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform searches.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        search: search,
        courseCode: courseCode,
        category: category,
        userId: user.id,
        round: selectedRound,
        stream: stream
      });

      const res = await fetch(`/api/data/${selectedYear}?${queryParams}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await res.json();

      if (append) {
        setData(prevData => [...prevData, ...responseData.data]);
      } else {
        setData(responseData.data);
      }
      
      setTotalCount(responseData.count);
      setHasMore(responseData.data.length === 20);
      setRemainingSearches(responseData.remainingSearches);
      setNextResetTime(new Date(responseData.nextResetTime));

      if (responseData.remainingSearches <= 10) {
        toast({
          title: "Low on searches",
          description: (
            <div>
              You have {responseData.remainingSearches} searches left. 
              <Link href="/suggestions" className="ml-1 text-blue-500 hover:underline">
                Submit a suggestion
              </Link> to get 30 more!
            </div>
          ),
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedRound, toast, user]);

  useEffect(() => {
    fetchDataAndCheckLimit(1, activeSearchTerm, selectedCourseCode, selectedCategory, selectedStream, false);
  }, [fetchDataAndCheckLimit, activeSearchTerm, selectedCourseCode, selectedCategory, selectedStream]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchDataAndCheckLimit(currentPage, activeSearchTerm, selectedCourseCode, selectedCategory, selectedStream, true);
    }
  }, [currentPage, activeSearchTerm, fetchDataAndCheckLimit, selectedCourseCode, selectedCategory, selectedStream]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent, courseCode: string, category: string, year: string, round: string, stream: string) => {
    event.preventDefault();
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
    setSelectedYear(year);
    setSelectedRound(round);
    setSelectedStream(stream);
    setSelectedCategory(category);
    setSelectedCourseCode(courseCode);
    fetchDataAndCheckLimit(1, searchTerm, courseCode, category, stream, false);
    const queryParams = new URLSearchParams({
      search: searchTerm,
      courseCode: courseCode,
      category: category,
      year: year,
      round: round,
      stream: stream
    });
    router.push(`/counselling/${year}?${queryParams}`);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
    setData([]);
  };

  const handleRoundChange = (round: string) => {
    setSelectedRound(round);
    setCurrentPage(1);
    setData([]);
  };

  return (
    <div>
      <SearchForm 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        isLoading={isLoading}
        selectedYear={selectedYear}
        selectedRound={selectedRound}
        onYearChange={handleYearChange}
        onRoundChange={handleRoundChange}
      />
      <div className="text-sm text-gray-500 mb-2">
        Remaining searches: {remainingSearches}
        {nextResetTime && (
          <span className="ml-2">
            (Resets in {formatDistanceToNow(nextResetTime)})
          </span>
        )}
        <Link href="/suggestions" className="ml-2 text-blue-500 hover:underline">
          Submit a suggestion to get more searches!
        </Link>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CET No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Verified Category</TableHead>
              <TableHead>Category Allotted</TableHead>
              <TableHead>Course Fee</TableHead>
              <TableHead>S. No. Allotted Option</TableHead>
              <TableHead>Stream</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row, index) => (
                <TableRow
                  key={row.id}
                  ref={index === data.length - 1 ? lastElementRef : null}
                  data-state={row.id === "selected" && "selected"}
                >
                  <TableCell>{row.cet_no}</TableCell>
                  <TableCell>{row.candidate_name}</TableCell>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>{row.course_name}</TableCell>
                  <TableCell>{row.course_code}</TableCell>
                  <TableCell>{row.verified_category}</TableCell>
                  <TableCell>{row.category_allotted}</TableCell>
                  <TableCell>{row.course_fee}</TableCell>
                  <TableCell>{row.serial_number_allotted_option}</TableCell>
                  <TableCell>{row.stream}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isLoading && <TableSkeleton />}
    </div>
  );
};

export default PaginatedTable;