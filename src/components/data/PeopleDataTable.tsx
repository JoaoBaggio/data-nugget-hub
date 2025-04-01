
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api-mock";
import { FilterField, User, FilterParams } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface PeopleDataTableProps {
  initialPageSize?: number;
}

export const PeopleDataTable = ({ initialPageSize = 10 }: PeopleDataTableProps) => {
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    pageSize: initialPageSize,
    field: undefined,
    value: "",
  });

  const [filterField, setFilterField] = useState<FilterField | undefined>(undefined);
  const [filterValue, setFilterValue] = useState<string>("");

  // Fetch users with the current filter params
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", filterParams],
    queryFn: () => fetchUsers(filterParams),
  });

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (field: FilterField | undefined, value: string) => {
    setFilterField(field);
    setFilterValue(value);
  };

  const applyFilter = () => {
    setFilterParams((prev) => ({
      ...prev,
      field: filterField,
      value: filterValue,
      page: 1, // Reset to first page when applying filter
    }));
  };

  const clearFilter = () => {
    setFilterField(undefined);
    setFilterValue("");
    setFilterParams((prev) => ({
      ...prev,
      field: undefined,
      value: "",
      page: 1,
    }));
  };

  // Calculate pagination values
  const totalPages = data ? Math.ceil(data.total / filterParams.pageSize) : 0;
  const startIndex = data ? (filterParams.page - 1) * filterParams.pageSize + 1 : 0;
  const endIndex = data
    ? Math.min(startIndex + filterParams.pageSize - 1, data.total)
    : 0;

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 items-end pb-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="filter-field">
            Filter by
          </label>
          <Select
            value={filterField}
            onValueChange={(value) => handleFilterChange(value as FilterField, filterValue)}
          >
            <SelectTrigger className="w-[180px]" id="filter-field">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="first_name">First Name</SelectItem>
              <SelectItem value="last_name">Last Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 flex-1 max-w-sm">
          <label className="text-sm font-medium" htmlFor="filter-value">
            Search value
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="filter-value"
              value={filterValue}
              onChange={(e) => handleFilterChange(filterField, e.target.value)}
              placeholder="Enter search term"
              disabled={!filterField}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filterField) {
                  applyFilter();
                }
              }}
            />
            {(filterField && filterValue) && (
              <Button variant="ghost" size="icon" onClick={clearFilter} className="shrink-0">
                <X size={18} />
              </Button>
            )}
          </div>
        </div>
        
        <Button
          onClick={applyFilter}
          disabled={!filterField || !filterValue}
          className="shrink-0"
        >
          <Search className="mr-2 h-4 w-4" />
          Apply Filter
        </Button>

        {(filterParams.field && filterParams.value) && (
          <Button variant="outline" onClick={clearFilter} className="shrink-0">
            <X className="mr-2 h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>

      {/* Active filter indicator */}
      {filterParams.field && filterParams.value && (
        <div className="bg-muted py-2 px-4 rounded-md text-sm flex items-center">
          <span className="font-medium mr-2">Active filter:</span>
          <span>
            {filterParams.field === "email" ? "Email" : 
             filterParams.field === "first_name" ? "First Name" : "Last Name"} 
            {" "}contains "{filterParams.value}"
          </span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-DEFAULT border-t-transparent"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Error loading data
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {data.total} {data.total === 1 ? "entry" : "entries"}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filterParams.page - 1)}
              disabled={filterParams.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm font-medium">
              Page {filterParams.page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filterParams.page + 1)}
              disabled={filterParams.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
