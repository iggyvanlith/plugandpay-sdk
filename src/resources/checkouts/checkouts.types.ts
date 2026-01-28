import type { PaginationMeta } from '../../types.js';

// --- Filters ---

export interface CheckoutFilters {
  limit?: number;
  page?: number;
  query?: string;
}

// --- Checkout Entity ---

export interface Checkout {
  id: number;
  name?: string;
  slug?: string;
  url?: string;
  isActive?: boolean;
  productId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// --- Create / Update Data ---

export interface CheckoutCreateData {
  name?: string;
  slug?: string;
  isActive?: boolean;
  productId?: number;
}

export interface CheckoutUpdateData {
  name?: string;
  slug?: string;
  isActive?: boolean;
  productId?: number;
}

// --- Response Types ---

export interface CheckoutListResponse {
  data: Checkout[];
  meta: PaginationMeta;
}

export interface CheckoutResponse {
  data: Checkout;
}
