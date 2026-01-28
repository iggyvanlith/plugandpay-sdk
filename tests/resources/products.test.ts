import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { ProductsService } from '../../src/resources/products/products.service.js';
import { ProductIncludes } from '../../src/resources/products/products.types.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('ProductsService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new ProductsService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches products', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, title: 'Product A' }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/products' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/products');
    });

    it('sends filters and includes', async () => {
      const mockFetch = createMockFetch({
        body: { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0, from: null, to: null, path: '/v2/products' } },
      });

      await service.list({
        filters: { hasLimitedStock: true, query: 'test' },
        include: [ProductIncludes.Pricing],
      });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('has_limited_stock=1');
      expect(url).toContain('query=test');
      expect(url).toContain('include=pricing');
    });
  });

  describe('get', () => {
    it('fetches a single product', async () => {
      createMockFetch({ body: { data: { id: 1, title: 'Product A' } } });
      const product = await service.get(1);
      expect(product.id).toBe(1);
      expect(product.title).toBe('Product A');
    });
  });

  describe('create', () => {
    it('creates a product', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 2, title: 'New Product' } } });
      const product = await service.create({ title: 'New Product' });
      expect(product.id).toBe(2);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
    });
  });

  describe('update', () => {
    it('updates a product', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1, title: 'Updated' } } });
      const product = await service.update(1, { title: 'Updated' });
      expect(product.title).toBe('Updated');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    });
  });

  describe('delete', () => {
    it('deletes a product', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.delete(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
    });
  });
});
