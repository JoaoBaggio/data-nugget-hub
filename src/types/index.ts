
export interface User {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  country?: string;
}

export type FilterField = "email" | "first_name" | "last_name";

export interface ContactInfo {
  email: string;
  first_name: string;
  last_name: string;
  country: string;
}

export interface Contact {
  user_id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string;
  last_name: string;
  info: ContactInfo;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ContactsApiResponse {
  fields: string;
  contacts: Contact[];
  pagination: Pagination;
}

export interface FilterParams {
  field?: FilterField;
  value?: string;
  limit: number;
  page?: number;
  userId?: string;
}

export interface SignedUploadUrlResponse {
  uploadUrl: string;
  key: string;
}
