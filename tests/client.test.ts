import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../src/client.js';
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from '../src/errors.js';
import { createMockFetch, restoreFetch } from './helpers/mock-fetch.js';

describe('HttpClient', () => {
  const client = new HttpClient({
    apiToken: 'test-token',
    baseUrl: 'https://api.plugandpay.com',
  });

  afterEach(() => {
    restoreFetch();
  });

  describe('GET request', () => {
    it('sends correct headers and method', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1 } } });
      await client.get('/v2/orders/1');

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.plugandpay.com/v2/orders/1');
      expect(init?.method).toBe('GET');
      expect(init?.headers).toEqual(
        expect.objectContaining({
          Authorization: 'Bearer test-token',
          Accept: 'application/json',
        }),
      );
      expect(init?.body).toBeUndefined();
    });

    it('converts response keys from snake_case to camelCase', async () => {
      createMockFetch({
        body: {
          data: {
            id: 1,
            invoice_number: 'INV-001',
            created_at: '2024-01-01',
          },
        },
      });

      const result = await client.get<{ data: { id: number; invoiceNumber: string; createdAt: string } }>('/v2/orders/1');
      expect(result.data.invoiceNumber).toBe('INV-001');
      expect(result.data.createdAt).toBe('2024-01-01');
    });
  });

  describe('POST request', () => {
    it('sends JSON body with snake_case keys', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1 } } });
      await client.post('/v2/orders', { invoiceStatus: 'final', isFirst: true });

      const [, init] = mockFetch.mock.calls[0];
      expect(init?.method).toBe('POST');
      expect(init?.headers).toEqual(
        expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      );
      expect(JSON.parse(init?.body as string)).toEqual({
        invoice_status: 'final',
        is_first: true,
      });
    });
  });

  describe('PATCH request', () => {
    it('sends PATCH method with body', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1 } } });
      await client.patch('/v2/orders/1', { tags: ['vip'] });

      const [, init] = mockFetch.mock.calls[0];
      expect(init?.method).toBe('PATCH');
    });
  });

  describe('DELETE request', () => {
    it('handles 204 No Content', async () => {
      createMockFetch({ status: 204 });
      const result = await client.delete('/v2/orders/1');
      expect(result).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('throws AuthenticationError on 401', async () => {
      createMockFetch({ status: 401, body: { message: 'Unauthenticated' } });
      await expect(client.get('/v2/orders')).rejects.toThrow(AuthenticationError);
    });

    it('throws ForbiddenError on 403', async () => {
      createMockFetch({ status: 403, body: { message: 'Forbidden' } });
      await expect(client.get('/v2/orders')).rejects.toThrow(ForbiddenError);
    });

    it('throws NotFoundError on 404', async () => {
      createMockFetch({ status: 404, body: { message: 'Not Found' } });
      await expect(client.get('/v2/orders/999')).rejects.toThrow(NotFoundError);
    });

    it('throws ValidationError on 422', async () => {
      createMockFetch({
        status: 422,
        body: { errors: { email: ['required'] } },
      });
      await expect(client.post('/v2/orders', {})).rejects.toThrow(ValidationError);
    });

    it('throws RateLimitError on 429', async () => {
      createMockFetch({ status: 429, body: {} });
      await expect(client.get('/v2/orders')).rejects.toThrow(RateLimitError);
    });

    it('throws ServerError on 500', async () => {
      createMockFetch({ status: 500, body: { message: 'Internal Server Error' } });
      await expect(client.get('/v2/orders')).rejects.toThrow(ServerError);
    });
  });
});
