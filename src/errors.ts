export class PlugAndPayError extends Error {
  public readonly statusCode: number;
  public readonly responseBody: unknown;

  constructor(message: string, statusCode: number, responseBody?: unknown) {
    super(message);
    this.name = 'PlugAndPayError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export class AuthenticationError extends PlugAndPayError {
  constructor(responseBody?: unknown) {
    super('Authentication failed. Check your API token.', 401, responseBody);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends PlugAndPayError {
  constructor(responseBody?: unknown) {
    super('Access denied. Insufficient permissions.', 403, responseBody);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends PlugAndPayError {
  constructor(responseBody?: unknown) {
    super('Resource not found.', 404, responseBody);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends PlugAndPayError {
  public readonly errors: Record<string, string[]>;

  constructor(responseBody?: unknown) {
    super('Validation failed.', 422, responseBody);
    this.name = 'ValidationError';
    this.errors =
      responseBody && typeof responseBody === 'object' && 'errors' in responseBody
        ? (responseBody as { errors: Record<string, string[]> }).errors
        : {};
  }
}

export class RateLimitError extends PlugAndPayError {
  constructor(responseBody?: unknown) {
    super('Rate limit exceeded. Please retry later.', 429, responseBody);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends PlugAndPayError {
  constructor(statusCode: number, responseBody?: unknown) {
    super(`Server error (${statusCode}).`, statusCode, responseBody);
    this.name = 'ServerError';
  }
}

export class TimeoutError extends PlugAndPayError {
  constructor() {
    super('Request timed out.', 0);
    this.name = 'TimeoutError';
  }
}
