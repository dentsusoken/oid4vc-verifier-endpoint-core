import { describe, it, expect } from 'vitest';
import { createGenerateTransactionIdInvoker } from './GenerateTransactionIdJose';
import { TransactionId } from '../../../domain';

describe('GenerateTransactionIdJose', () => {
  it('should generate a transaction ID with the default byte length', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(32);
    const result = await generateTransactionId();
    expect(result.isSuccess).toBe(true);
    const transactionId = result.getOrThrow();
    expect(transactionId.constructor).toBe(TransactionId);
    expect(transactionId.value).toHaveLength(43); // Base64URL-encoded length for 32 bytes
  });

  it('should generate a transaction ID with a custom byte length', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(64);
    const result = await generateTransactionId();
    expect(result.isSuccess).toBe(true);
    const transactionId = result.getOrThrow();
    expect(transactionId.constructor).toBe(TransactionId);
    expect(transactionId.value).toHaveLength(86); // Base64URL-encoded length for 64 bytes
  });

  it('should throw an error if the byte length is less than 32', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(16);
    const result = await generateTransactionId();
    expect(result.isFailure).toBe(true);
    expect(result.exceptionOrNull()?.message).toBe(
      'The byte length must be greater than or equal to 32'
    );
  });

  it('should generate unique transaction IDs', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(32);
    const result1 = await generateTransactionId();
    expect(result1.isSuccess).toBe(true);
    const transactionId1 = result1.getOrThrow();

    const result2 = await generateTransactionId();
    expect(result2.isSuccess).toBe(true);
    const transactionId2 = result2.getOrThrow();

    expect(transactionId1.value).not.toBe(transactionId2.value);
  });
});
