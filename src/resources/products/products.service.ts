import type { HttpClient } from '../../client.js';
import type { ListOptions, GetOptions, CreateOptions, UpdateOptions, PaginatedResponse } from '../../types.js';
import type {
  Product,
  ProductCreateData,
  ProductUpdateData,
  ProductFilters,
  ProductIncludes,
} from './products.types.js';
import { buildQueryString } from '../../utils/query-params.js';

export class ProductsService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: ListOptions<ProductFilters, ProductIncludes>,
  ): Promise<PaginatedResponse<Product>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
      include: options?.include,
    });
    return this.client.get<PaginatedResponse<Product>>(`/v2/products${qs}`);
  }

  async get(
    id: number,
    options?: GetOptions<ProductIncludes>,
  ): Promise<Product> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.get<{ data: Product }>(`/v2/products/${id}${qs}`);
    return response.data;
  }

  async create(
    data: ProductCreateData,
    options?: CreateOptions<ProductIncludes>,
  ): Promise<Product> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.post<{ data: Product }>(`/v2/products${qs}`, data);
    return response.data;
  }

  async update(
    id: number,
    data: ProductUpdateData,
    options?: UpdateOptions<ProductIncludes>,
  ): Promise<Product> {
    const qs = buildQueryString({ include: options?.include });
    const response = await this.client.patch<{ data: Product }>(`/v2/products/${id}${qs}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/v2/products/${id}`);
  }
}
