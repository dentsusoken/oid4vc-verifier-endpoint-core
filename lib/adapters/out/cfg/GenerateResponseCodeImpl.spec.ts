import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGenerateResponseCodeInvoker } from './GenerateResponseCodeImpl';
import { ResponseCode } from '../../../domain';
import * as uuid from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('createGenerateResponseCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a function', () => {
    const generateResponseCode = createGenerateResponseCodeInvoker();
    expect(typeof generateResponseCode).toBe('function');
  });

  describe('generated function', () => {
    it('should generate a ResponseCode with a UUID', async () => {
      const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
      vi.mocked(uuid.v4).mockReturnValue(mockUuid);

      const generateResponseCode = createGenerateResponseCodeInvoker();
      const result = await generateResponseCode();

      expect(result).toBeInstanceOf(ResponseCode);
      expect(result.value).toBe(mockUuid);
      expect(uuid.v4).toHaveBeenCalledTimes(1);
    });

    it('should generate a new UUID for each call', async () => {
      const mockUuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const mockUuid2 = '987e6543-e21b-12d3-a456-426614174000';
      vi.mocked(uuid.v4)
        .mockReturnValueOnce(mockUuid1)
        .mockReturnValueOnce(mockUuid2);

      const generateResponseCode = createGenerateResponseCodeInvoker();
      const result1 = await generateResponseCode();
      const result2 = await generateResponseCode();

      expect(result1.value).toBe(mockUuid1);
      expect(result2.value).toBe(mockUuid2);
      expect(result1.value).not.toBe(result2.value);
      expect(uuid.v4).toHaveBeenCalledTimes(2);
    });
  });
});
