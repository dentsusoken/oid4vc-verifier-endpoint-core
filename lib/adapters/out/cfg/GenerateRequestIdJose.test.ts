import { describe, it, expect } from 'vitest';
import { createGenerateRequestIdHoseInvoker } from './GenerateRequestIdJose';
import { RequestId } from '../../../domain';

describe('GenerateRequestIdJose', () => {
  it('should generate a request ID with the default byte length', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(32);
    const requestId = await generateRequestId();
    expect(requestId).toBeInstanceOf(RequestId);
    expect(requestId.value).toHaveLength(43); // Base64URL-encoded length for 32 bytes
  });

  it('should generate a request ID with a custom byte length', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(64);
    const requestId = await generateRequestId();
    expect(requestId).toBeInstanceOf(RequestId);
    expect(requestId.value).toHaveLength(86); // Base64URL-encoded length for 64 bytes
  });

  it('should throw an error if the byte length is less than 32', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(16);
    await expect(generateRequestId).toThrow(
      'The byte length must be greater than or equal to 32'
    );
  });

  it('should generate unique request IDs', async () => {
    const generateRequestId = createGenerateRequestIdHoseInvoker(32);
    const requestId1 = await generateRequestId();
    const requestId2 = await generateRequestId();
    expect(requestId1.value).not.toBe(requestId2.value);
  });
});
