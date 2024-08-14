import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFormProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSearchChange, onSearchSubmit, isLoading }) => {
  return (
    <form onSubmit={onSearchSubmit} className=" items-center mt-4 w-full">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full"
        />
        <Button type="submit" disabled={isLoading}>Search</Button>
      </div>
    </form>
  );
};

export default SearchForm;