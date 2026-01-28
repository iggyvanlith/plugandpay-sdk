import type { PaginationMeta } from '../../types.js';

// --- Membership Settings Entity ---

export interface MembershipSettings {
  id: number;
  name?: string;
  provider?: string;
  providerSettings?: Record<string, unknown>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Create / Update Data ---

export interface MembershipSettingsCreateData {
  name?: string;
  provider?: string;
  providerSettings?: Record<string, unknown>;
  isActive?: boolean;
}

export interface MembershipSettingsUpdateData {
  name?: string;
  provider?: string;
  providerSettings?: Record<string, unknown>;
  isActive?: boolean;
}

// --- Response Types ---

export interface MembershipSettingsListResponse {
  data: MembershipSettings[];
  meta: PaginationMeta;
}

export interface MembershipSettingsResponse {
  data: MembershipSettings;
}
