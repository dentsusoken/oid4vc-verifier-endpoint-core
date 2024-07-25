import { describe, it, expect } from 'vitest';
import { GenerateTransactionId } from './GenerateTransactionId';
import { TransactionId } from '../../../domain';

describe('GenerateTransactionId', () => {
  it('should generate a transaction ID', async () => {
    const generateTransactionId: GenerateTransactionId = async () =>
      new TransactionId('test-transaction-id');
    const transactionId = await generateTransactionId();
    expect(transactionId).toEqual(new TransactionId('test-transaction-id'));
  });

  describe('fixed', () => {
    it('should return a fixed transaction ID', async () => {
      const fixedTransactionId: TransactionId = new TransactionId(
        'fixed-transaction-id'
      );
      const generateTransactionId =
        GenerateTransactionId.fixed(fixedTransactionId);
      const transactionId = await generateTransactionId();
      expect(transactionId).toEqual(fixedTransactionId);
    });
  });
});
