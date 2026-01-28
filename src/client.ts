import {
  PlugAndPayError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  TimeoutError,
} from './errors.js';
import { toCamelCase, toSnakeCase } from './utils/query-params.js';

export interface HttpClientOptions {
  apiToken: string;
  baseUrl?: string;
  timeout?: number;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly timeout: number;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl ?? 'https://api.plugandpay.com';
    this.apiToken = options.apiToken;
    this.timeout = options.timeout ?? 30_000;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  async delete<T = void>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Accept': 'application/json',
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;

    try {
      response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(toSnakeCase(body)) : undefined,
        signal: controller.signal,
      });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError();
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = undefined;
    }

    if (!response.ok) {
      this.throwError(response.status, responseBody);
    }

    return toCamelCase(responseBody) as T;
  }

  private throwError(status: number, body: unknown): never {
    switch (status) {
      case 401:
        throw new AuthenticationError(body);
      case 403:
        throw new ForbiddenError(body);
      case 404:
        throw new NotFoundError(body);
      case 422:
        throw new ValidationError(body);
      case 429:
        throw new RateLimitError(body);
      default:
        if (status >= 500) {
          throw new ServerError(status, body);
        }
        throw new PlugAndPayError(
          `Request failed with status ${status}`,
          status,
          body,
        );
    }
  }
}
