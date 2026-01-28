import { describe, it, expect } from 'vitest';
import {
  PlugAndPayError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  TimeoutError,
} from '../src/errors.js';

describe('Errors', () => {
  it('PlugAndPayError has correct properties', () => {
    const error = new PlugAndPayError('test error', 400, { message: 'bad request' });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.message).toBe('test error');
    expect(error.statusCode).toBe(400);
    expect(error.responseBody).toEqual({ message: 'bad request' });
    expect(error.name).toBe('PlugAndPayError');
  });

  it('AuthenticationError has status 401', () => {
    const error = new AuthenticationError();
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('AuthenticationError');
  });

  it('ForbiddenError has status 403', () => {
    const error = new ForbiddenError();
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(403);
    expect(error.name).toBe('ForbiddenError');
  });

  it('NotFoundError has status 404', () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });

  it('ValidationError parses errors from response body', () => {
    const body = { errors: { email: ['required', 'invalid'], name: ['required'] } };
    const error = new ValidationError(body);
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(422);
    expect(error.errors).toEqual(body.errors);
    expect(error.name).toBe('ValidationError');
  });

  it('ValidationError handles missing errors object', () => {
    const error = new ValidationError({ message: 'invalid' });
    expect(error.errors).toEqual({});
  });

  it('RateLimitError has status 429', () => {
    const error = new RateLimitError();
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(429);
    expect(error.name).toBe('RateLimitError');
  });

  it('ServerError has custom status code', () => {
    const error = new ServerError(503);
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(503);
    expect(error.name).toBe('ServerError');
  });

  it('TimeoutError has status 0', () => {
    const error = new TimeoutError();
    expect(error).toBeInstanceOf(PlugAndPayError);
    expect(error.statusCode).toBe(0);
    expect(error.name).toBe('TimeoutError');
  });
});
