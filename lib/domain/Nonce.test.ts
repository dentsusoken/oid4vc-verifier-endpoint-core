import { describe, it, expect } from 'vitest';
import { Nonce } from './Nonce';

describe('Nonce', () => {
  it('should create an instance of Nonce with a valid value', () => {
    const value = 'abc123';
    const nonce = new Nonce(value);
    expect(nonce.constructor).toBe(Nonce);
    expect(nonce.value).toBe(value);
  });

  it('should throw an error when creating an instance with an empty value', () => {
    expect(() => new Nonce('')).toThrowError('value is required');
  });

  it('should throw an error when creating an instance with a null value', () => {
    expect(() => new Nonce(null as never)).toThrowError('value is required');
  });

  it('should throw an error when creating an instance with an undefined value', () => {
    expect(() => new Nonce(undefined as never)).toThrowError(
      'value is required'
    );
  });
});
