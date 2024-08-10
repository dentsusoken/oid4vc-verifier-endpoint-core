import { describe, it, expect } from 'vitest';
import { TransactionId } from './TransactionId';

describe('TransactionId', () => {
  it('should create an instance of TransactionId with a valid value', () => {
    const value = 'abc123';
    const transactionId = new TransactionId(value);
    expect(transactionId.constructor).toBe(TransactionId);
    expect(transactionId.value).toBe(value);
  });

  it('should throw an error when creating an instance with an empty value', () => {
    expect(() => new TransactionId('')).toThrowError('value is required');
  });

  it('should throw an error when creating an idnstance with a null value', () => {
    expect(() => new TransactionId(null as never)).toThrowError(
      'value is required'
    );
  });

  it('should throw an error when creating an instance with an undefined value', () => {
    expect(() => new TransactionId(undefined as never)).toThrowError(
      'value is required'
    );
  });
});
