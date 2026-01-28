import type { Address, Contact, PaginationMeta } from '../../types.js';
import type { ContractType } from '../../enums/contract-type.js';
import type { DiscountType } from '../../enums/discount-type.js';
import type { InvoiceStatus } from '../../enums/invoice-status.js';
import type { ItemType } from '../../enums/item-type.js';
import type { Mode } from '../../enums/mode.js';
import type { PaymentMethod } from '../../enums/payment-method.js';
import type { PaymentStatus } from '../../enums/payment-status.js';
import type { PaymentType } from '../../enums/payment-type.js';
import type { Source } from '../../enums/source.js';
import type { Direction } from '../../enums/direction.js';

// --- Includes ---

export enum OrderIncludes {
  Billing = 'billing',
  Items = 'items',
  Payment = 'payment',
  Discounts = 'discounts',
  Taxes = 'taxes',
  Comments = 'comments',
  Tags = 'tags',
}

// --- Filters ---

export interface OrderFilters {
  affiliateId?: number;
  checkoutId?: number;
  contractId?: number;
  email?: string;
  query?: string;
  paymentStatus?: PaymentStatus;
  invoiceStatus?: InvoiceStatus;
  sinceInvoiceDate?: string;
  untilInvoiceDate?: string;
  sincePaidAt?: string;
  untilPaidAt?: string;
  limit?: number;
  page?: number;
  direction?: Direction;
  sort?: string;
  mode?: Mode;
  source?: Source;
}

// --- Order Entity ---

export interface Order {
  id: number;
  invoiceNumber?: string;
  invoiceStatus?: InvoiceStatus;
  mode?: Mode;
  source?: Source;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isFirst?: boolean;
  isHidden?: boolean;

  // Included fields
  billing?: OrderBilling;
  items?: OrderItem[];
  payment?: OrderPayment;
  discounts?: OrderDiscount[];
  taxes?: OrderTax[];
  comments?: OrderComment[];
  tags?: string[];
}

export interface OrderBilling {
  address?: Address;
  contact?: Contact;
}

export interface OrderItem {
  id?: number;
  label?: string;
  productId?: number;
  quantity?: number;
  type?: ItemType;
  amount?: number;
  amountWithTax?: number;
  taxRate?: number;
}

export interface OrderPayment {
  id?: number;
  orderId?: number;
  method?: PaymentMethod;
  provider?: string;
  status?: PaymentStatus;
  type?: PaymentType;
  url?: string;
  paidAt?: string | null;
  customerId?: string;
  transactionId?: string;
}

export interface OrderDiscount {
  id?: number;
  code?: string;
  type?: DiscountType;
  amount?: number;
}

export interface OrderTax {
  id?: number;
  rate?: number;
  amount?: number;
}

export interface OrderComment {
  id?: number;
  body?: string;
  createdAt?: string;
}

// --- Create / Update Data ---

export interface OrderCreateData {
  invoiceStatus?: InvoiceStatus;
  mode?: Mode;
  isFirst?: boolean;
  isHidden?: boolean;
  billing?: OrderBilling;
  items?: Partial<OrderItem>[];
  payment?: Partial<OrderPayment>;
  tags?: string[];
  contractType?: ContractType;
}

export interface OrderUpdateData {
  invoiceStatus?: InvoiceStatus;
  isFirst?: boolean;
  isHidden?: boolean;
  billing?: OrderBilling;
  items?: Partial<OrderItem>[];
  tags?: string[];
}

// --- Payment Update ---

export interface OrderPaymentUpdateData {
  status?: PaymentStatus;
  method?: PaymentMethod;
  provider?: string;
  transactionId?: string;
}

// --- Response Types ---

export interface OrderListResponse {
  data: Order[];
  meta: PaginationMeta;
}

export interface OrderResponse {
  data: Order;
}
