
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchContacts } from "@/lib/api";
import { Contact, ContactsApiResponse, FilterParams } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PeopleDataTableProps {
  initialPageSize?: number;
}

export const PeopleDataTable = ({ initialPageSize = 5 }: PeopleDataTableProps) => {
  const { toast } = useToast();
  const [filterParams, setFilterParams] = useState<FilterParams>({
    limit: initialPageSize,
    page: 1,
    userId: 'test-user'
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contacts", filterParams],
    queryFn: () => fetchContacts(filterParams)
  });

  const handlePageChange = (page: number) => {
    setFilterParams(prev => ({
      ...prev,
      page
    }));
  };

  const renderPagination = () => {
    if (!data?.pagination) return null;
    
    const { page, pages } = data.pagination;
    const pageItems = [];
    
    // Always show first page
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={page === 1} 
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If there are many pages, show ellipsis after first page
    if (page > 3) {
      pageItems.push(
        <PaginationItem key="ellipsis-start">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      if (i === 1 || i === pages) continue; // Skip first and last as they're always shown
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={page === i} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // If there are many pages, show ellipsis before last page
    if (page < pages - 2) {
      pageItems.push(
        <PaginationItem key="ellipsis-end">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (pages > 1) {
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={page === pages} 
            onClick={() => handlePageChange(pages)}
          >
            {pages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, page - 1))} 
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {pageItems}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(pages, page + 1))} 
              className={page >= pages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-DEFAULT border-t-transparent"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Error loading data
                </TableCell>
              </TableRow>
            ) : data?.contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data?.contacts.map((contact: Contact, index) => (
                <TableRow key={`${contact.email}-${index}`}>
                  <TableCell>{contact.first_name}</TableCell>
                  <TableCell>{contact.last_name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.info.country}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && data && data.contacts.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.pages} 
            ({data.pagination.total} total records)
          </div>
          {renderPagination()}
        </div>
      )}
    </div>
  );
};
