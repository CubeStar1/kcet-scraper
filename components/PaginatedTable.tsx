"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableSkeleton from './TableSkeleton';
import SearchForm from './SearchForm';
import { useToast } from "@/components/ui/use-toast";
import useUser from '@/app/hook/useUser'; 
import { formatDistanceToNow } from 'date-fns'; 

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
}

const PaginatedTable = ({ year }: { year: string })  => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<TableData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeSearchTerm, setActiveSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState(60);
  const [error, setError] = useState('');
  const [nextResetTime, setNextResetTime] = useState<Date | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 20;
  const totalPages = Math.ceil(totalCount / pageSize);

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

  const fetchDataAndCheckLimit = useCallback(async (page: number, search: string, courseCode: string, category: string, append: boolean = false) => {
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
      // Check search limit and fetch data in a single API call
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: search,
        courseCode: courseCode,
        category: category,
        userId: user.id
      });
      console.log(`queryParams: ${queryParams}`)

      const res = await fetch(`/api/data/${year}?${queryParams}`);
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
      setHasMore(responseData.data.length === pageSize);
      setRemainingSearches(responseData.remainingSearches);
      setNextResetTime(new Date(responseData.nextResetTime));

      // Show toast when remaining searches are low
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
          duration: 10000, // Show for 10 seconds
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
  }, [year, pageSize, toast, user]);

  useEffect(() => {
    fetchDataAndCheckLimit(1, '', '', '', false);
  }, [fetchDataAndCheckLimit]);

  // useEffect(() => {
  //   fetchDataAndCheckLimit(currentPage, activeSearchTerm, searchParams.get('courseCode') || '', searchParams.get('category') || '', currentPage > 1);
  // }, [currentPage, activeSearchTerm, searchParams, fetchDataAndCheckLimit]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent, courseCode: string, category: string) => {
    event.preventDefault();
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
    fetchDataAndCheckLimit(1, searchTerm, courseCode, category);
    const queryParams = new URLSearchParams({
      search: searchTerm,
      courseCode: courseCode,
      category: category
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center sm:flex-row mb-4">
        <SearchForm 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          isLoading={isLoading}
        />
      </div>
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
      <div className="rounded-md">
        <Table className="border-2 max-h-[500px] overflow-y-auto">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: TableData, index: number) => (
              <TableRow key={item.id} ref={index === data.length - 1 ? lastElementRef : null}>
                <TableCell>{item.cet_no}</TableCell>
                <TableCell>{item.candidate_name}</TableCell>
                <TableCell>{item.rank}</TableCell>
                <TableCell>{item.course_name}</TableCell>
                <TableCell>{item.course_code}</TableCell>
                <TableCell>{item.verified_category}</TableCell>
                <TableCell>{item.category_allotted}</TableCell>
                <TableCell>{item.course_fee}</TableCell>
                <TableCell>{item.serial_number_allotted_option}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isLoading && <TableSkeleton />}
    </div>
  );
};

export default PaginatedTable;