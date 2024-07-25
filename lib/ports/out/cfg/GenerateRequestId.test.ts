import { describe, it, expect } from 'vitest';
import { GenerateRequestId } from './GenerateRequestId';
import { RequestId } from '../../../domain';

describe('GenerateRequestId', () => {
  it('should generate a request ID', async () => {
    const generateRequestId: GenerateRequestId = async () =>
      new RequestId('test-request-id');
    const requestId = await generateRequestId();
    expect(requestId.value).toEqual('test-request-id');
  });

  describe('fixed', () => {
    it('should return a fixed request ID', async () => {
      const fixedRequestId = new RequestId('fixed-request-id');
      const generateRequestId = GenerateRequestId.fixed(fixedRequestId);
      const requestId = await generateRequestId();
      const requestId2 = await generateRequestId();
      expect(requestId.value).toBe(fixedRequestId.value);
      expect(requestId2.value).toBe(fixedRequestId.value);
    });
  });
});
