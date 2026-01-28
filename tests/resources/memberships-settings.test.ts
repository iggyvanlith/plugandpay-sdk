import { describe, it, expect, afterEach } from 'vitest';
import { HttpClient } from '../../src/client.js';
import { MembershipsSettingsService } from '../../src/resources/memberships/memberships-settings.service.js';
import { createMockFetch, restoreFetch } from '../helpers/mock-fetch.js';

describe('MembershipsSettingsService', () => {
  const client = new HttpClient({ apiToken: 'test-token' });
  const service = new MembershipsSettingsService(client);

  afterEach(() => {
    restoreFetch();
  });

  describe('list', () => {
    it('fetches membership settings', async () => {
      const mockFetch = createMockFetch({
        body: {
          data: [{ id: 1, name: 'Membership 1' }],
          meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, path: '/v2/memberships/settings' },
        },
      });

      const result = await service.list();
      expect(result.data).toHaveLength(1);
      expect(mockFetch.mock.calls[0][0]).toContain('/v2/memberships/settings');
    });
  });

  describe('get', () => {
    it('fetches a single membership settings', async () => {
      createMockFetch({ body: { data: { id: 1, name: 'Membership 1' } } });
      const settings = await service.get(1);
      expect(settings.id).toBe(1);
      expect(settings.name).toBe('Membership 1');
    });
  });

  describe('create', () => {
    it('creates membership settings', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 2, name: 'New Settings' } } });
      const settings = await service.create({ name: 'New Settings' });
      expect(settings.id).toBe(2);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
    });
  });

  describe('update', () => {
    it('updates membership settings', async () => {
      const mockFetch = createMockFetch({ body: { data: { id: 1, name: 'Updated' } } });
      const settings = await service.update(1, { name: 'Updated' });
      expect(settings.name).toBe('Updated');
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    });
  });

  describe('delete', () => {
    it('deletes membership settings', async () => {
      const mockFetch = createMockFetch({ status: 204 });
      await service.delete(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
    });
  });
});
