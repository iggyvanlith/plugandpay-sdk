import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { OrdersService } from '../../src/resources/orders/orders.service.js';
import { OrderIncludes } from '../../src/resources/orders/orders.types.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('OrdersService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new OrdersService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches orders without options', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1 }, { id: 2 }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 2, from: 1, to: 2, path: '/v2/orders' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(2);
      expect(result.meta.currentPage).toBe(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/orders');
    });

    it('sends filters as query params', async () => {
      const mockFetch = createMockFetch({
        body: { data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0, from: null, to: null, path: '/v2/orders' } },
      });

      await service.list({
        filters: { paymentStatus: 'paid' as any, limit: 25 },
        include: [OrderIncludes.Billing, OrderIncludes.Items],
      });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('payment_status=paid');
      expect(url).toContain('limit=25');
      expect(url).toContain('include=billing%2Citems');
    });
  });

  describe('get', () => {
    it('fetches a single order and unwraps data', async () => {
      const mockFetch = createMockFetch({
        body: { data: { id: 123, invoice_number: 'INV-001' } },
      });

      const order = await service.get(123);
      expect(order.id).toBe(123);
      expect(order.invoiceNumber).toBe('INV-001');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/orders/123');
    });

    it('sends include parameter', async () => {
      const mockFetch = createMockFetch({
        body: { data: { id: 123 } },
      });

      await service.get(123, { include: [OrderIncludes.Payment] });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('include=payment');
    });
  });

  describe('create', () => {
    it('sends POST with body and returns unwrapped data', async () => {
      const mockFetch = createMockFetch({
        body: { data: { id: 456, invoice_status: 'concept' } },
      });

      const order = await service.create({ invoiceStatus: 'concept' as any });
      expect(order.id).toBe(456);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
      const sentBody = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(sentBody.invoice_status).toBe('concept');
    });
  });

  describe('update', () => {
    it('sends PATCH with body and returns unwrapped data', async () => {
      const mockFetch = createMockFetch({
        body: { data: { id: 123, tags: ['vip'] } },
      });

      const order = await service.update(123, { tags: ['vip'] });
      expect(order.id).toBe(123);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/orders/123');
    });
  });

  describe('delete', () => {
    it('sends DELETE request', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.delete(123);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/orders/123');
    });
  });
});
