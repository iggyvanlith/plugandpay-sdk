/**
 * Converts a camelCase string to snake_case.
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts a snake_case string to camelCase.
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * Deep-converts all keys of an object from camelCase to snake_case.
 */
export function toSnakeCase(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[camelToSnake(key)] = toSnakeCase(value);
    }
    return result;
  }
  return obj;
}

/**
 * Deep-converts all keys of an object from snake_case to camelCase.
 */
export function toCamelCase(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[snakeToCamel(key)] = toCamelCase(value);
    }
    return result;
  }
  return obj;
}

/**
 * Builds a query string from filter params and include array.
 * Filter values are converted from camelCase to snake_case keys.
 * Boolean values are converted to "1" / "0".
 */
export function buildQueryString(params: {
  filters?: Record<string, unknown>;
  include?: string[];
}): string {
  const searchParams = new URLSearchParams();

  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value === undefined || value === null) continue;

      const snakeKey = camelToSnake(key);

      if (typeof value === 'boolean') {
        searchParams.append(snakeKey, value ? '1' : '0');
      } else if (Array.isArray(value)) {
        searchParams.append(snakeKey, value.join(','));
      } else {
        searchParams.append(snakeKey, String(value));
      }
    }
  }

  if (params.include && params.include.length > 0) {
    searchParams.append('include', params.include.join(','));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}
