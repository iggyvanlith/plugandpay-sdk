import type { HttpClient } from '../../client.js';
import type { PaginatedResponse } from '../../types.js';
import type {
  Checkout,
  CheckoutCreateData,
  CheckoutUpdateData,
  CheckoutFilters,
} from './checkouts.types.js';
import { buildQueryString } from '../../utils/query-params.js';

export class CheckoutsService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: { filters?: CheckoutFilters },
  ): Promise<PaginatedResponse<Checkout>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
    });
    return this.client.get<PaginatedResponse<Checkout>>(`/v2/checkouts${qs}`);
  }

  async get(id: number): Promise<Checkout> {
    const response = await this.client.get<{ data: Checkout }>(`/v2/checkouts/${id}`);
    return response.data;
  }

  async create(data: CheckoutCreateData): Promise<Checkout> {
    const response = await this.client.post<{ data: Checkout }>('/v2/checkouts', data);
    return response.data;
  }

  async update(id: number, data: CheckoutUpdateData): Promise<Checkout> {
    const response = await this.client.patch<{ data: Checkout }>(`/v2/checkouts/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/v2/checkouts/${id}`);
  }
}
