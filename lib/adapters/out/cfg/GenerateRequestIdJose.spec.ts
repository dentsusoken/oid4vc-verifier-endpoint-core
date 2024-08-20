import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { createGenerateRequestIdHoseInvoker } from './GenerateRequestIdJose';
import { RequestId } from '../../../domain';

describe('GenerateRequestIdJose', () => {
  it('should generate a request ID with the default byte length', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(32);
    const result = await generateRequestId();
    expect(result.isSuccess).toBe(true);
    const requestId = result.getOrThrow();
    expect(requestId.constructor).toBe(RequestId);
    expect(requestId.value).toHaveLength(43); // Base64URL-encoded length for 32 bytes
  });

  it('should generate a request ID with a custom byte length', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(64);
    const result = await generateRequestId();
    expect(result.isSuccess).toBe(true);
    const requestId = result.getOrThrow();
    expect(requestId.constructor).toBe(RequestId);
    expect(requestId.value).toHaveLength(86); // Base64URL-encoded length for 64 bytes
  });

  it('should throw an error if the byte length is less than 32', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(16);
    const result = await generateRequestId();
    expect(result.isFailure).toBe(true);
    expect(result.exceptionOrNull()?.message).toBe(
      'The byte length must be greater than or equal to 32'
    );
  });

  it('should generate unique request IDs', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(32);
    const result1 = await generateRequestId();
    expect(result1.isSuccess).toBe(true);
    const requestId1 = result1.getOrThrow();

    const result2 = await generateRequestId();
    expect(result2.isSuccess).toBe(true);
    const requestId2 = result2.getOrThrow();

    expect(requestId1.value).not.toBe(requestId2.value);
  });
});
