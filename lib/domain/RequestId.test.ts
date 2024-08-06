import { describe, it, expect } from 'vitest';
import { RequestId } from './RequestId';

describe('RequestId', () => {
  it('should create an instance of RequestId with a valid value', () => {
    const value = 'abc123';
    const requestId = new RequestId(value);
    expect(requestId.constructor).toBe(RequestId);
    expect(requestId.value).toBe(value);
  });

  it('should throw an error when creating an instance with an empty value', () => {
    expect(() => new RequestId('')).toThrowError('value is required');
  });

  it('should throw an error when creating an instance with a null value', () => {
    expect(() => new RequestId(null as never)).toThrowError(
      'value is required'
    );
  });

  it('should throw an error when creating an instance with an undefined value', () => {
    expect(() => new RequestId(undefined as never)).toThrowError(
      'value is required'
    );
  });
});
