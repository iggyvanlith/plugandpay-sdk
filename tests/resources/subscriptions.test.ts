import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { SubscriptionsService } from '../../src/resources/subscriptions/subscriptions.service.js';
import { SubscriptionIncludes } from '../../src/resources/subscriptions/subscriptions.types.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('SubscriptionsService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new SubscriptionsService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches subscriptions', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, status: 'active' }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/subscriptions' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/subscriptions');
    });

    it('sends filters and includes', async () => {
      const mockFetch = createMockFetch({
        body: { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0, from: null, to: null, path: '/v2/subscriptions' } },
      });

      await service.list({
        filters: { status: 'active' as any, isTrial: false },
        include: [SubscriptionIncludes.Billing, SubscriptionIncludes.Pricing],
      });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('status=active');
      expect(url).toContain('is_trial=0');
      expect(url).toContain('include=billing%2Cpricing');
    });
  });

  describe('get', () => {
    it('fetches a single subscription', async () => {
      createMockFetch({ body: { data: { id: 5, status: 'active' } } });
      const sub = await service.get(5);
      expect(sub.id).toBe(5);
      expect(sub.status).toBe('active');
    });
  });

  describe('create', () => {
    it('creates a subscription', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 10, status: 'active' } } });
      const sub = await service.create({ status: 'active' as any });
      expect(sub.id).toBe(10);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
    });
  });

  describe('update', () => {
    it('updates a subscription', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 5, status: 'cancelled' } } });
      const sub = await service.update(5, { status: 'cancelled' as any });
      expect(sub.status).toBe('cancelled');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    });
  });

  describe('delete', () => {
    it('deletes a subscription', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.delete(5);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
    });
  });
});
