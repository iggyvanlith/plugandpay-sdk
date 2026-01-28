import type { HttpClient } from '../../client.js';
import type { ListOptions, GetOptions, CreateOptions, UpdateOptions, PaginatedResponse } from '../../types.js';
import type {
  Subscription,
  SubscriptionCreateData,
  SubscriptionUpdateData,
  SubscriptionFilters,
  SubscriptionIncludes,
} from './subscriptions.types.js';
import { buildQueryString } from '../../utils/query-params.js';

export class SubscriptionsService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: ListOptions<SubscriptionFilters, SubscriptionIncludes>,
  ): Promise<PaginatedResponse<Subscription>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
      include: options?.include,
    });
    return this.client.get<PaginatedResponse<Subscription>>(`/v2/subscriptions${qs}`);
  }

  async get(
    id: number,
    options?: GetOptions<SubscriptionIncludes>,
  ): Promise<Subscription> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.get<{ data: Subscription }>(`/v2/subscriptions/${id}${qs}`);
    return response.data;
  }

  async create(
    data: SubscriptionCreateData,
    options?: CreateOptions<SubscriptionIncludes>,
  ): Promise<Subscription> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.post<{ data: Subscription }>(`/v2/subscriptions${qs}`, data);
    return response.data;
  }

  async update(
    id: number,
    data: SubscriptionUpdateData,
    options?: UpdateOptions<SubscriptionIncludes>,
  ): Promise<Subscription> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.patch<{ data: Subscription }>(`/v2/subscriptions/${id}${qs}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/v2/subscriptions/${id}`);
  }
}
