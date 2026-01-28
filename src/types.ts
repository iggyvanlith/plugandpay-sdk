import type { CountryCode } from './enums/country-code.js';

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  from: number | null;
  lastPage: number;
  path: string;
  perPage: number;
  to: number | null;
  total: number;
}

export interface Address {
  city?: string;
  country?: CountryCode;
  street?: string;
  houseNumber?: string;
  zipcode?: string;
}

export interface Contact {
  company?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  website?: string;
  vatIdNumber?: string;
}

export interface ListOptions<TFilters = Record<string, unknown>, TIncludes extends string = string> {
  filters?: TFilters;
  include?: TIncludes[];
}

export interface GetOptions<TIncludes extends string = string> {
  include?: TIncludes[];
}

export interface CreateOptions<TIncludes extends string = string> {
  include?: TIncludes[];
}

export interface UpdateOptions<TIncludes extends string = string> {
  include?: TIncludes[];
}
