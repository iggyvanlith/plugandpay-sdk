import type { PaginationMeta } from '../../types.js';

// --- Filters ---

export interface RuleFilters {
  limit?: number;
  page?: number;
  query?: string;
}

// --- Rule Entity ---

export interface Rule {
  id: number;
  name?: string;
  trigger?: string;
  conditions?: RuleCondition[];
  actions?: RuleAction[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RuleCondition {
  field?: string;
  operator?: string;
  value?: unknown;
}

export interface RuleAction {
  type?: string;
  params?: Record<string, unknown>;
}

// --- Create / Update Data ---

export interface RuleCreateData {
  name?: string;
  trigger?: string;
  conditions?: Partial<RuleCondition>[];
  actions?: Partial<RuleAction>[];
  isActive?: boolean;
}

export interface RuleUpdateData {
  name?: string;
  trigger?: string;
  conditions?: Partial<RuleCondition>[];
  actions?: Partial<RuleAction>[];
  isActive?: boolean;
}

// --- Response Types ---

export interface RuleListResponse {
  data: Rule[];
  meta: PaginationMeta;
}

export interface RuleResponse {
  data: Rule;
}
