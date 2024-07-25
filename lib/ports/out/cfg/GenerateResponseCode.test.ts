import { describe, it, expect } from 'vitest';
import { GenerateResponseCode } from './GenerateResponseCode';
import { ResponseCode } from '../../../domain';

describe('GenerateResponseCode', () => {
  it('should generate a response code', async () => {
    const generateResponseCode: GenerateResponseCode = async () =>
      new ResponseCode('test-response-code');
    const responseCode = await generateResponseCode();
    expect(responseCode).toEqual(new ResponseCode('test-response-code'));
  });

  describe('Random', () => {
    it('should generate a random response code', async () => {
      const responseCode = await GenerateResponseCode.Random();
      expect(responseCode).toBeInstanceOf(ResponseCode);
      expect(responseCode.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe('fixed', () => {
    it('should return a fixed response code', async () => {
      const fixedResponseCode: ResponseCode = new ResponseCode(
        'fixed-response-code'
      );
      const generateResponseCode =
        GenerateResponseCode.fixed(fixedResponseCode);
      const responseCode = await generateResponseCode();
      expect(responseCode).toEqual(fixedResponseCode);
    });
  });
});
