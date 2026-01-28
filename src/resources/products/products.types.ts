import type { PaginationMeta } from '../../types.js';
import type { Direction } from '../../enums/direction.js';
import type { ItemType } from '../../enums/item-type.js';

// --- Includes ---

export enum ProductIncludes {
  Pricing = 'pricing',
  TaxRates = 'tax_rates',
}

// --- Filters ---

export interface ProductFilters {
  direction?: Direction;
  hasLimitedStock?: boolean;
  isDeleted?: boolean;
  limit?: number;
  page?: number;
  query?: string;
  sort?: string;
  tag?: string;
  type?: ItemType;
}

// --- Product Entity ---

export interface Product {
  id: number;
  title?: string;
  description?: string;
  slug?: string;
  type?: ItemType;
  isPhysical?: boolean;
  stockEnabled?: boolean;
  stockAmount?: number | null;
  ledgerNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  // Included fields
  pricing?: ProductPricing;
  taxRates?: ProductTaxRate[];
}

export interface ProductPricing {
  isTaxIncluded?: boolean;
  amount?: number;
  amountWithTax?: number;
  taxRate?: number;
  shippingAmount?: number;
}

export interface ProductTaxRate {
  id?: number;
  percentage?: number;
  country?: string;
}

// --- Create / Update Data ---

export interface ProductCreateData {
  title?: string;
  description?: string;
  slug?: string;
  type?: ItemType;
  isPhysical?: boolean;
  stockEnabled?: boolean;
  stockAmount?: number | null;
  ledgerNumber?: string | null;
  pricing?: Partial<ProductPricing>;
}

export interface ProductUpdateData {
  title?: string;
  description?: string;
  slug?: string;
  type?: ItemType;
  isPhysical?: boolean;
  stockEnabled?: boolean;
  stockAmount?: number | null;
  ledgerNumber?: string | null;
  pricing?: Partial<ProductPricing>;
}

// --- Response Types ---

export interface ProductListResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductResponse {
  data: Product;
}
