"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import TablePagination from './TablePagination';
import { useToast } from "@/components/ui/use-toast";
import  useUser  from '@/app/hook/useUser'; 
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

const PaginatedTable = ({ initialData, initialTotalCount, year }: { initialData: TableData[], initialTotalCount: number, year: string })  => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [data, setData] = useState(initialData);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeSearchTerm, setActiveSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState(60);
  const [error, setError] = useState('');
  const [nextResetTime, setNextResetTime] = useState<Date | null>(null);

  const pageSize = 20;

  const totalPages = Math.ceil(totalCount / pageSize);

  const { toast } = useToast();

  const { data: user } = useUser(); // Use the useUser hook

  const checkSearchLimit = useCallback(async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform searches.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch('/api/search-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setRemainingSearches(data.remainingSearches);
        setNextResetTime(new Date(data.nextResetTime));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    }
    return true;
  }, [user, toast]);

  const fetchData = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    setError('');
    try {
      const canProceed = await checkSearchLimit();
      if (!canProceed) return;

      const res = await fetch(`/api/data/${year}?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const newData = await res.json();
      setData(newData.data);
      setTotalCount(newData.count);
      setCurrentPage(page);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError('An error occurred');
      }
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [year, pageSize, checkSearchLimit, toast]);

  useEffect(() => {
    fetchData(currentPage, activeSearchTerm);
  }, [currentPage, activeSearchTerm, fetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage, activeSearchTerm);
      router.push(`?page=${newPage}&search=${encodeURIComponent(activeSearchTerm)}`, { scroll: false });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const canProceed = await checkSearchLimit();
    if (canProceed) {
      setActiveSearchTerm(searchTerm);
      fetchData(1, searchTerm);
      router.push(`?page=1&search=${encodeURIComponent(searchTerm)}`, { scroll: false });
    }
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
        <div className="flex justify-end items-center sm:justify-start">
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        Remaining searches: {remainingSearches}
        {nextResetTime && (
          <span className="ml-2">
            (Resets in {formatDistanceToNow(nextResetTime)})
          </span>
        )}
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {isLoading ? (
        <TableSkeleton />
      ) : (
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
              {data.map((item: TableData) => (
                <TableRow key={item.id}>
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
      )}
    </div>
  );
};

export default PaginatedTable;