import { describe, it, expect } from 'vitest';
import {
  camelToSnake,
  snakeToCamel,
  toSnakeCase,
  toCamelCase,
  buildQueryString,
} from '../../src/utils/query-params.js';

describe('camelToSnake', () => {
  it('converts camelCase to snake_case', () => {
    expect(camelToSnake('paymentStatus')).toBe('payment_status');
    expect(camelToSnake('sinceInvoiceDate')).toBe('since_invoice_date');
    expect(camelToSnake('id')).toBe('id');
  });
});

describe('snakeToCamel', () => {
  it('converts snake_case to camelCase', () => {
    expect(snakeToCamel('payment_status')).toBe('paymentStatus');
    expect(snakeToCamel('since_invoice_date')).toBe('sinceInvoiceDate');
    expect(snakeToCamel('id')).toBe('id');
  });
});

describe('toSnakeCase', () => {
  it('deep converts object keys to snake_case', () => {
    const input = {
      firstName: 'John',
      billingAddress: {
        streetName: '123 Main St',
        zipCode: '12345',
      },
    };
    expect(toSnakeCase(input)).toEqual({
      first_name: 'John',
      billing_address: {
        street_name: '123 Main St',
        zip_code: '12345',
      },
    });
  });

  it('handles arrays', () => {
    const input = [{ firstName: 'John' }, { firstName: 'Jane' }];
    expect(toSnakeCase(input)).toEqual([
      { first_name: 'John' },
      { first_name: 'Jane' },
    ]);
  });

  it('handles primitives', () => {
    expect(toSnakeCase(null)).toBeNull();
    expect(toSnakeCase(undefined)).toBeUndefined();
    expect(toSnakeCase(42)).toBe(42);
    expect(toSnakeCase('hello')).toBe('hello');
  });
});

describe('toCamelCase', () => {
  it('deep converts object keys to camelCase', () => {
    const input = {
      first_name: 'John',
      billing_address: {
        street_name: '123 Main St',
        zip_code: '12345',
      },
    };
    expect(toCamelCase(input)).toEqual({
      firstName: 'John',
      billingAddress: {
        streetName: '123 Main St',
        zipCode: '12345',
      },
    });
  });

  it('handles arrays', () => {
    const input = [{ first_name: 'John' }, { first_name: 'Jane' }];
    expect(toCamelCase(input)).toEqual([
      { firstName: 'John' },
      { firstName: 'Jane' },
    ]);
  });

  it('handles primitives', () => {
    expect(toCamelCase(null)).toBeNull();
    expect(toCamelCase(undefined)).toBeUndefined();
    expect(toCamelCase(42)).toBe(42);
    expect(toCamelCase('hello')).toBe('hello');
  });
});

describe('buildQueryString', () => {
  it('returns empty string when no params', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('builds query string from filters', () => {
    const qs = buildQueryString({
      filters: { paymentStatus: 'paid', limit: 25 },
    });
    expect(qs).toBe('?payment_status=paid&limit=25');
  });

  it('converts boolean values to 1/0', () => {
    const qs = buildQueryString({
      filters: { hasLimitedStock: true, isDeleted: false },
    });
    expect(qs).toBe('?has_limited_stock=1&is_deleted=0');
  });

  it('appends include parameter', () => {
    const qs = buildQueryString({
      include: ['billing', 'items'],
    });
    expect(qs).toBe('?include=billing%2Citems');
  });

  it('combines filters and includes', () => {
    const qs = buildQueryString({
      filters: { limit: 10 },
      include: ['payment'],
    });
    expect(qs).toBe('?limit=10&include=payment');
  });

  it('skips null and undefined values', () => {
    const qs = buildQueryString({
      filters: { email: null, query: undefined, limit: 10 },
    });
    expect(qs).toBe('?limit=10');
  });

  it('joins array values with commas', () => {
    const qs = buildQueryString({
      filters: { ids: [1, 2, 3] },
    });
    expect(qs).toBe('?ids=1%2C2%2C3');
  });
});
