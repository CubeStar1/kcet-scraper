import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent, courseCode: string, categoryAllotted: string, year: string, round: string, stream: string) => void;
  isLoading: boolean;
  selectedYear: string;
  selectedRound: string;
  onYearChange: (year: string) => void;
  onRoundChange: (round: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit, 
  isLoading,
  selectedYear,
  selectedRound,
  onYearChange,
  onRoundChange
}) => {
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [streams, setStreams] = useState<string[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filter-options');
        if (!response.ok) throw new Error('Failed to fetch filter options');
        const data = await response.json();
        setCourseCodes(data.courseCodes);
        setCategories(data.categories);
        setStreams(data.streams);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        toast({
          title: "Error",
          description: "Failed to load filter options",
          variant: "destructive",
        });
      }
    };

    fetchFilterOptions();
  }, [toast]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearchSubmit(event, selectedCourseCode, selectedCategory, selectedYear, selectedRound, selectedStream);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col items-center mt-4 w-full sm:flex-row">
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedRound} onValueChange={onRoundChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Round" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="m1">Mock 1</SelectItem>
          <SelectItem value="m2">Mock 2</SelectItem>
          <SelectItem value="pr1">Provisional Round 1</SelectItem>
          <SelectItem value="r1">Round 1</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search..."
        className="w-full"
        disabled={isLoading}
      />
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Categories">All Categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedStream} onValueChange={setSelectedStream}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Stream" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Streams">All Streams</SelectItem>
          {streams.map(stream => (
            <SelectItem key={stream} value={stream}>{stream}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={selectedCourseCode}
        onChange={e => setSelectedCourseCode(e.target.value)}
        placeholder="Course Code"
        className="w-full"
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="py-2 w-full"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchForm;