import { vi } from 'vitest';

export interface MockFetchOptions {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export function createMockFetch(options: MockFetchOptions = {}) {
  const { status = 200, body = {}, headers = {} } = options;

  const mockFn = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(
    async () => {
      return {
        ok: status >= 200 && status < 300,
        status,
        headers: new Headers(headers),
        json: async () => body,
      } as Response;
    },
  );

  vi.stubGlobal('fetch', mockFn);
  return mockFn;
}

export function createMockFetchSequence(responses: MockFetchOptions[]) {
  let callIndex = 0;

  const mockFn = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(
    async () => {
      const options = responses[callIndex] ?? responses[responses.length - 1];
      callIndex++;
      const { status = 200, body = {} } = options;
      return {
        ok: status >= 200 && status < 300,
        status,
        headers: new Headers(),
        json: async () => body,
      } as Response;
    },
  );

  vi.stubGlobal('fetch', mockFn);
  return mockFn;
}

export function restoreFetch() {
  vi.restoreAllMocks();
}
