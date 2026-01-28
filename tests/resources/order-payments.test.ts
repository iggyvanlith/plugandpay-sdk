import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { OrdersService } from '../../src/resources/orders/orders.service.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('OrderPaymentsService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const ordersService = new OrdersService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('get', () => {
    it('fetches payment for an order', async () => {
      const mockFetch = createMockFetch({
        body: { data: { id: 10, order_id: 123, status: 'paid', method: 'ideal' } },
      });

      const payment = await ordersService.payment(123).get();
      expect(payment.id).toBe(10);
      expect(payment.orderId).toBe(123);
      expect(payment.status).toBe('paid');
      expect(payment.method).toBe('ideal');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/orders/123/payment');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('GET');
    });
  });

  describe('update', () => {
    it('updates payment for an order', async () => {
      const mockFetch = createMockFetch({
        body: { data: { id: 10, order_id: 123, status: 'paid' } },
      });

      const payment = await ordersService.payment(123).update({ status: 'paid' as any });
      expect(payment.status).toBe('paid');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/orders/123/payment');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    });
  });
});
