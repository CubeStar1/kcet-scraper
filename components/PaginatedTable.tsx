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
import { Button } from './ui/button';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

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

const PaginatedTable = ({ initialData, initialTotalCount, year }: { initialData: TableData[], initialTotalCount: number, year: string })  => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [data, setData] = useState(initialData);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeSearchTerm, setActiveSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchData = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/data/${year}?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const newData = await res.json();
      setData(newData.data);
      setTotalCount(newData.count);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

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

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveSearchTerm(searchTerm);
    fetchData(1, searchTerm);
    router.push(`?page=1&search=${encodeURIComponent(searchTerm)}`, { scroll: false });
  };

  return (
    <div>
          <Card className="w-full flex-col">
            <CardHeader>
                <CardTitle className="flex flex-col gap-2 md:flex-row">
                    <InfoIcon />
                    <span className="text-sm md:text-base">All data has not been updated yet.</span>
                    <span className="text-sm md:text-base"> Please check back later.</span>
                </CardTitle>
            </CardHeader>
        </Card>
        <div className="flex flex-col justify-center items-center  sm:flex-row mb-4">
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
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className=" rounded-md">
          <Table className="border-2 max-h-[500px] overflow-y-auto">
            <TableHeader className="">
              <TableRow>
                <TableHead>CET No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Verified Category</TableHead>
                <TableHead>Category Allotted</TableHead>
                <TableHead>Course Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
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