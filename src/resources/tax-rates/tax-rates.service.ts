import type { HttpClient } from '../../client.js';
import type { PaginatedResponse } from '../../types.js';
import type { TaxRate, TaxRateFilters } from './tax-rates.types.js';
import { buildQueryString } from '../../utils/query-params.js';

export class TaxRatesService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: { filters?: TaxRateFilters },
  ): Promise<PaginatedResponse<TaxRate>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
    });
    return this.client.get<PaginatedResponse<TaxRate>>(`/v2/tax-rates${qs}`);
  }
}
