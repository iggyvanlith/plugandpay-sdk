import type { HttpClient } from '../../client.js';
import type { OrderPayment, OrderPaymentUpdateData } from './orders.types.js';

export class OrderPaymentsService {
  constructor(
    private readonly client: HttpClient,
    private readonly orderId: number,
  ) {}

  async get(): Promise<OrderPayment> {
    const response = await this.client.get<{ data: OrderPayment }>(
      `/v2/orders/${this.orderId}/payment`,
    );
    return response.data;
  }

  async update(data: OrderPaymentUpdateData): Promise<OrderPayment> {
    const response = await this.client.patch<{ data: OrderPayment }>(
      `/v2/orders/${this.orderId}/payment`,
      data,
    );
    return response.data;
  }
}
