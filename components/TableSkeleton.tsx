import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TableSkeleton = () => {
  return (
    <Table className="border-2 rounded-lg">
      <TableHeader>
        <TableRow>
          {Array(8).fill(null).map((_, index) => (
            <TableHead key={index}>
              <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(10).fill(null).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array(8).fill(null).map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;