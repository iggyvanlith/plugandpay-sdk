import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { CheckoutsService } from '../../src/resources/checkouts/checkouts.service.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('CheckoutsService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new CheckoutsService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches checkouts', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, name: 'Main Checkout' }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/checkouts' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/checkouts');
    });
  });

  describe('get', () => {
    it('fetches a single checkout', async () => {
      createMockFetch({ body: { data: { id: 1, name: 'Main Checkout' } } });
      const checkout = await service.get(1);
      expect(checkout.id).toBe(1);
      expect(checkout.name).toBe('Main Checkout');
    });
  });

  describe('create', () => {
    it('creates a checkout', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 2, name: 'New Checkout' } } });
      const checkout = await service.create({ name: 'New Checkout' });
      expect(checkout.id).toBe(2);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
    });
  });

  describe('update', () => {
    it('updates a checkout', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1, name: 'Updated' } } });
      const checkout = await service.update(1, { name: 'Updated' });
      expect(checkout.name).toBe('Updated');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    });
  });

  describe('delete', () => {
    it('deletes a checkout', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.delete(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
    });
  });
});
