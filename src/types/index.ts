
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type FilterField = "email" | "first_name" | "last_name";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterParams {
  field?: FilterField;
  value?: string;
  page: number;
  pageSize: number;
}
