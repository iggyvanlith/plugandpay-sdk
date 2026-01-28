import type { HttpClient } from '../../client.js';
import type { ListOptions, GetOptions, PaginatedResponse } from '../../types.js';
import type {
  AffiliateSeller,
  AffiliateSellerFilters,
  AffiliateSellerIncludes,
} from './affiliate-sellers.types.js';
import { buildQueryString } from '../../utils/query-params.js';

export class AffiliateSellersService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: ListOptions<AffiliateSellerFilters, AffiliateSellerIncludes>,
  ): Promise<PaginatedResponse<AffiliateSeller>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
      include: options?.include,
    });
    return this.client.get<PaginatedResponse<AffiliateSeller>>(`/v2/affiliates/sellers${qs}`);
  }

  async get(
    id: number,
    options?: GetOptions<AffiliateSellerIncludes>,
  ): Promise<AffiliateSeller> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.get<{ data: AffiliateSeller }>(
      `/v2/affiliates/sellers/${id}${qs}`,
    );
    return response.data;
  }
}
