import type { HttpClient } from '../../client.js';
import type { PaginatedResponse } from '../../types.js';
import type {
  Rule,
  RuleCreateData,
  RuleUpdateData,
  RuleFilters,
} from './rules.types.js';
import { buildQueryString } from '../../utils/query-params.js';

export class RulesService {
  constructor(private readonly client: HttpClient) {}

  async list(
    options?: { filters?: RuleFilters },
  ): Promise<PaginatedResponse<Rule>> {
    const qs = buildQueryString({
      filters: options?.filters as Record<string, unknown> | undefined,
    });
    return this.client.get<PaginatedResponse<Rule>>(`/v2/rules${qs}`);
  }

  async get(id: number): Promise<Rule> {
    const response = await this.client.get<{ data: Rule }>(`/v2/rules/${id}`);
    return response.data;
  }

  async create(data: RuleCreateData): Promise<Rule> {
    const response = await this.client.post<{ data: Rule }>('/v2/rules', data);
    return response.data;
  }

  async update(id: number, data: RuleUpdateData): Promise<Rule> {
    const response = await this.client.patch<{ data: Rule }>(`/v2/rules/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/v2/rules/${id}`);
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.client.delete(`/v2/rules?ids=${ids.join(',')}`);
  }
}
