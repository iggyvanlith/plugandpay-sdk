import type { Address, Contact, PaginationMeta } from '../../types.js';
import type { SellerStatus } from '../../enums/seller-status.js';

// --- Includes ---

export enum AffiliateSellerIncludes {
  Address = 'address',
  Contact = 'contact',
  Profile = 'profile',
  Statistics = 'statistics',
  PayoutOptions = 'payout_options',
  PayoutMethods = 'payout_methods',
}

// --- Filters ---

export interface AffiliateSellerFilters {
  limit?: number;
  page?: number;
  query?: string;
  status?: SellerStatus;
}

// --- Affiliate Seller Entity ---

export interface AffiliateSeller {
  id: number;
  status?: SellerStatus;
  createdAt?: string;
  updatedAt?: string;

  // Included fields
  address?: Address;
  contact?: Contact;
  profile?: AffiliateSellerProfile;
  statistics?: AffiliateSellerStatistics;
  payoutOptions?: AffiliateSellerPayoutOptions;
  payoutMethods?: AffiliateSellerPayoutMethod[];
}

export interface AffiliateSellerProfile {
  bio?: string;
  website?: string;
}

export interface AffiliateSellerStatistics {
  totalSales?: number;
  totalCommission?: number;
  totalPaidOut?: number;
}

export interface AffiliateSellerPayoutOptions {
  minimumAmount?: number;
  interval?: string;
}

export interface AffiliateSellerPayoutMethod {
  type?: string;
  details?: Record<string, unknown>;
}

// --- Response Types ---

export interface AffiliateSellerListResponse {
  data: AffiliateSeller[];
  meta: PaginationMeta;
}

export interface AffiliateSellerResponse {
  data: AffiliateSeller;
}
