
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  onRefresh: () => void;
}

const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  filter, 
  setFilter, 
  onRefresh 
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search submissions..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-2 w-full sm:w-auto">
        <div className="flex items-center space-x-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <select
            className="form-select border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in-review">In Review</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
