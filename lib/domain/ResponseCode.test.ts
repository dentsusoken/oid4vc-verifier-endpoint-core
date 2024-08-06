import { describe, it, expect } from 'vitest';
import { ResponseCode } from './ResponseCode';

describe('ResponseCode', () => {
  it('should create an instance of ResponseCode with the provided value', () => {
    // Given
    const value = '200';

    // When
    const responseCode = new ResponseCode(value);

    // Then
    expect(responseCode.value).toBe(value);
  });

  it('should allow accessing the value property', () => {
    // Given
    const value = '404';
    const responseCode = new ResponseCode(value);

    // When
    const result = responseCode.value;

    // Then
    expect(result).toBe(value);
  });

  it('should allow creating multiple instances with different values', () => {
    // Given
    const value1 = '200';
    const value2 = '404';

    // When
    const responseCode1 = new ResponseCode(value1);
    const responseCode2 = new ResponseCode(value2);

    // Then
    expect(responseCode1.value).toBe(value1);
    expect(responseCode2.value).toBe(value2);
  });
});
