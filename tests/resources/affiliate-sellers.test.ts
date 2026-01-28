import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { AffiliateSellersService } from '../../src/resources/affiliates/affiliate-sellers.service.js';
import { AffiliateSellerIncludes } from '../../src/resources/affiliates/affiliate-sellers.types.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('AffiliateSellersService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new AffiliateSellersService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches affiliate sellers', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, status: 'active' }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/affiliates/sellers' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/affiliates/sellers');
    });

    it('sends includes', async () => {
      const mockFetch = createMockFetch({
        body: { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0, from: null, to: null, path: '/v2/affiliates/sellers' } },
      });

      await service.list({
        include: [AffiliateSellerIncludes.Contact, AffiliateSellerIncludes.Statistics],
      });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('include=contact%2Cstatistics');
    });
  });

  describe('get', () => {
    it('fetches a single affiliate seller', async () => {
      createMockFetch({ body: { data: { id: 5, status: 'active' } } });
      const seller = await service.get(5);
      expect(seller.id).toBe(5);
      expect(seller.status).toBe('active');
    });

    it('sends includes', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 5 } } });
      await service.get(5, { include: [AffiliateSellerIncludes.Address] });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('include=address');
    });
  });
});
