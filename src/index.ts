import { HttpClient, type HttpClientOptions } from './client.js';
import { OrdersService } from './resources/orders/orders.service.js';
import { ProductsService } from './resources/products/products.service.js';
import { SubscriptionsService } from './resources/subscriptions/subscriptions.service.js';
import { CheckoutsService } from './resources/checkouts/checkouts.service.js';
import { RulesService } from './resources/rules/rules.service.js';
import { TaxRatesService } from './resources/tax-rates/tax-rates.service.js';
import { AffiliateSellersService } from './resources/affiliates/affiliate-sellers.service.js';
import { MembershipsSettingsService } from './resources/memberships/memberships-settings.service.js';

export interface PlugAndPayOptions {
  apiToken: string;
  baseUrl?: string;
  timeout?: number;
}

export class PlugAndPay {
  private readonly client: HttpClient;

  private _orders?: OrdersService;
  private _products?: ProductsService;
  private _subscriptions?: SubscriptionsService;
  private _checkouts?: CheckoutsService;
  private _rules?: RulesService;
  private _taxRates?: TaxRatesService;
  private _affiliateSellers?: AffiliateSellersService;
  private _membershipsSettings?: MembershipsSettingsService;

  constructor(options: PlugAndPayOptions) {
    this.client = new HttpClient(options);
  }

  get orders(): OrdersService {
    return (this._orders ??= new OrdersService(this.client));
  }

  get products(): ProductsService {
    return (this._products ??= new ProductsService(this.client));
  }

  get subscriptions(): SubscriptionsService {
    return (this._subscriptions ??= new SubscriptionsService(this.client));
  }

  get checkouts(): CheckoutsService {
    return (this._checkouts ??= new CheckoutsService(this.client));
  }

  get rules(): RulesService {
    return (this._rules ??= new RulesService(this.client));
  }

  get taxRates(): TaxRatesService {
    return (this._taxRates ??= new TaxRatesService(this.client));
  }

  get affiliateSellers(): AffiliateSellersService {
    return (this._affiliateSellers ??= new AffiliateSellersService(this.client));
  }

  get membershipsSettings(): MembershipsSettingsService {
    return (this._membershipsSettings ??= new MembershipsSettingsService(this.client));
  }
}

// Re-export everything
export { HttpClient, type HttpClientOptions } from './client.js';
export * from './errors.js';
export * from './enums/index.js';
export * from './types.js';
export * from './resources/index.js';
export { buildQueryString, camelToSnake, snakeToCamel, toCamelCase, toSnakeCase } from './utils/query-params.js';
