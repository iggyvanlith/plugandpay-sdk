import type { Address, Contact, PaginationMeta } from '../../types.js';
import type { CountryCode } from '../../enums/country-code.js';
import type { Direction } from '../../enums/direction.js';
import type { Interval } from '../../enums/interval.js';
import type { Mode } from '../../enums/mode.js';
import type { SubscriptionStatus } from '../../enums/subscription-status.js';

// --- Includes ---

export enum SubscriptionIncludes {
  Billing = 'billing',
  Pricing = 'pricing',
  Product = 'product',
  Tags = 'tags',
  Trial = 'trial',
  Meta = 'meta',
}

// --- Filters ---

export interface SubscriptionFilters {
  affiliateId?: number;
  billingScheduleInterval?: Interval;
  country?: CountryCode;
  direction?: Direction;
  hasOrders?: boolean;
  isTrial?: boolean;
  limit?: number;
  mode?: Mode;
  page?: number;
  productId?: number;
  query?: string;
  sinceCreatedAt?: string;
  status?: SubscriptionStatus;
  sort?: string;
  tag?: string;
  type?: string;
  untilCreatedAt?: string;
}

// --- Subscription Entity ---

export interface Subscription {
  id: number;
  mode?: Mode;
  status?: SubscriptionStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  cancelledAt?: string | null;

  // Included fields
  billing?: SubscriptionBilling;
  pricing?: SubscriptionPricing;
  product?: SubscriptionProduct;
  tags?: string[];
  trial?: SubscriptionTrial;
}

export interface SubscriptionBilling {
  address?: Address;
  contact?: Contact;
  schedule?: SubscriptionBillingSchedule;
}

export interface SubscriptionBillingSchedule {
  interval?: Interval;
  nextAt?: string | null;
  latestAt?: string | null;
}

export interface SubscriptionPricing {
  isTaxIncluded?: boolean;
  amount?: number;
  amountWithTax?: number;
  taxRate?: number;
  quantity?: number;
  first?: SubscriptionFirstPricing;
}

export interface SubscriptionFirstPricing {
  amount?: number;
  amountWithTax?: number;
}

export interface SubscriptionProduct {
  id?: number;
  title?: string;
}

export interface SubscriptionTrial {
  isActive?: boolean;
  endDate?: string | null;
}

// --- Create / Update Data ---

export interface SubscriptionCreateData {
  mode?: Mode;
  status?: SubscriptionStatus;
  billing?: Partial<SubscriptionBilling>;
  pricing?: Partial<SubscriptionPricing>;
  productId?: number;
  tags?: string[];
}

export interface SubscriptionUpdateData {
  status?: SubscriptionStatus;
  billing?: Partial<SubscriptionBilling>;
  pricing?: Partial<SubscriptionPricing>;
  tags?: string[];
}

// --- Response Types ---

export interface SubscriptionListResponse {
  data: Subscription[];
  meta: PaginationMeta;
}

export interface SubscriptionResponse {
  data: Subscription;
}
