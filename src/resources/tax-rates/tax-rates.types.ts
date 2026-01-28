import type { PaginationMeta } from '../../types.js';
import type { CountryCode } from '../../enums/country-code.js';

// --- Filters ---

export interface TaxRateFilters {
  limit?: number;
  page?: number;
  country?: CountryCode;
}

// --- Tax Rate Entity ---

export interface TaxRate {
  id: number;
  country?: CountryCode;
  percentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

// --- Response Types ---

export interface TaxRateListResponse {
  data: TaxRate[];
  meta: PaginationMeta;
}
