import { describe, it, expect } from 'vitest';
import { createGenerateTransactionIdInvoker } from './GenerateTransactionIdJose';
import { TransactionId } from '../../../domain';

describe('GenerateTransactionIdJose', () => {
  it('should generate a transaction ID with the default byte length', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(32);
    const transactionId = await generateTransactionId();
    expect(transactionId).toBeInstanceOf(TransactionId);
    expect(transactionId.value).toHaveLength(43); // Base64URL-encoded length for 32 bytes
  });

  it('should generate a transaction ID with a custom byte length', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(64);
    const transactionId = await generateTransactionId();
    expect(transactionId).toBeInstanceOf(TransactionId);
    expect(transactionId.value).toHaveLength(86); // Base64URL-encoded length for 64 bytes
  });

  it('should throw an error if the byte length is less than 32', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(16);
    await expect(generateTransactionId).toThrow(
      'The byte length must be greater than or equal to 32'
    );
  });

  it('should generate unique transaction IDs', async () => {
    const generateTransactionId = createGenerateTransactionIdInvoker(32);
    const transactionId1 = await generateTransactionId();
    const transactionId2 = await generateTransactionId();
    expect(transactionId1.value).not.toBe(transactionId2.value);
  });
});
