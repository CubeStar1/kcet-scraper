import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent, courseCode: string, categoryAllotted: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSearchChange, onSearchSubmit, isLoading }) => {
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filter-options');
        if (!response.ok) throw new Error('Failed to fetch filter options');
        const data = await response.json();
        setCourseCodes(data.courseCodes);
        setCategories(data.categories);
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
    onSearchSubmit(event, selectedCourseCode, selectedCategory);
  };

  return (
    <form onSubmit={handleSubmit} className=" flex gap-2 flex-col items-center mt-4 w-full sm:flex-row">
      <Input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search..."
        className="w-full"
        disabled={isLoading}
      />
      {/* <Select value={selectedCourseCode} onValueChange={setSelectedCourseCode}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Course Code" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Courses">All Courses</SelectItem>
          {courseCodes.map(code => (
            <SelectItem key={code} value={code}>{code}</SelectItem>
          ))}
        </SelectContent>
      </Select> */}
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