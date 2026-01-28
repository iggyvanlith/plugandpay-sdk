import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { RulesService } from '../../src/resources/rules/rules.service.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('RulesService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new RulesService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches rules', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, name: 'Rule 1' }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/rules' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/rules');
    });
  });

  describe('get', () => {
    it('fetches a single rule', async () => {
      createMockFetch({ body: { data: { id: 1, name: 'Rule 1' } } });
      const rule = await service.get(1);
      expect(rule.id).toBe(1);
      expect(rule.name).toBe('Rule 1');
    });
  });

  describe('create', () => {
    it('creates a rule', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 2, name: 'New Rule' } } });
      const rule = await service.create({ name: 'New Rule' });
      expect(rule.id).toBe(2);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
    });
  });

  describe('update', () => {
    it('updates a rule', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1, name: 'Updated Rule' } } });
      const rule = await service.update(1, { name: 'Updated Rule' });
      expect(rule.name).toBe('Updated Rule');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    });
  });

  describe('delete', () => {
    it('deletes a single rule', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.delete(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/rules/1');
    });
  });

  describe('deleteMany', () => {
    it('deletes multiple rules', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.deleteMany([1, 2, 3]);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/rules?ids=1,2,3');
    });
  });
});
