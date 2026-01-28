import type { HttpClient } from '../../client.js';
import type { PaginatedResponse } from '../../types.js';
import type {
  MembershipSettings,
  MembershipSettingsCreateData,
  MembershipSettingsUpdateData,
} from './memberships-settings.types.js';

export class MembershipsSettingsService {
  constructor(private readonly client: HttpClient) {}

  async list(): Promise<PaginatedResponse<MembershipSettings>> {
    return this.client.get<PaginatedResponse<MembershipSettings>>('/v2/memberships/settings');
  }

  async get(id: number): Promise<MembershipSettings> {
    const response = await this.client.get<{ data: MembershipSettings }>(
      `/v2/memberships/settings/${id}`,
    );
    return response.data;
  }

  async create(data: MembershipSettingsCreateData): Promise<MembershipSettings> {
    const response = await this.client.post<{ data: MembershipSettings }>(
      '/v2/memberships/settings',
      data,
    );
    return response.data;
  }

  async update(id: number, data: MembershipSettingsUpdateData): Promise<MembershipSettings> {
    const response = await this.client.patch<{ data: MembershipSettings }>(
      `/v2/memberships/settings/${id}`,
      data,
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/v2/memberships/settings/${id}`);
  }
}
