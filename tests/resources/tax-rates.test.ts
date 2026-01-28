import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { TaxRatesService } from '../../src/resources/tax-rates/tax-rates.service.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('TaxRatesService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new TaxRatesService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches tax rates', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, country: 'NL', percentage: 21 }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/tax-rates' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/tax-rates');
    });

    it('sends country filter', async () => {
      const mockFetch = createMockFetch({
        body: { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0, from: null, to: null, path: '/v2/tax-rates' } },
      });

      await service.list({ filters: { country: 'NL' as any } });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('country=NL');
    });
  });
});
