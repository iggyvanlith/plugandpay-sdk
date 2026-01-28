import type { HttpClient } from '../../client.js';
import type { ListOptions, GetOptions, CreateOptions, UpdateOptions, PaginatedResponse } from '../../types.js';
import type {
  Order,
  OrderCreateData,
  OrderUpdateData,
  OrderFilters,
  OrderIncludes,
} from './orders.types.js';
import { OrderPaymentsService } from './order-payments.service.js';
import { buildQueryString } from '../../utils/query-params.js';

export class OrdersService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: ListOptions<OrderFilters, OrderIncludes>,
  ): Promise<PaginatedResponse<Order>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
      include: options?.include,
    });
    return this.client.get<PaginatedResponse<Order>>(`/v2/orders${qs}`);
  }

  async get(
    id: number,
    options?: GetOptions<OrderIncludes>,
  ): Promise<Order> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.get<{ data: Order }>(`/v2/orders/${id}${qs}`);
    return response.data;
  }

  async create(
    data: OrderCreateData,
    options?: CreateOptions<OrderIncludes>,
  ): Promise<Order> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.post<{ data: Order }>(`/v2/orders${qs}`, data);
    return response.data;
  }

  async update(
    id: number,
    data: OrderUpdateData,
    options?: UpdateOptions<OrderIncludes>,
  ): Promise<Order> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.patch<{ data: Order }>(`/v2/orders/${id}${qs}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/v2/orders/${id}`);
  }

  payment(orderId: number): OrderPaymentsService {
    return new OrderPaymentsService(this.client, orderId);
  }
}
