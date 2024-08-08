import { describe, expect, it } from 'vitest';
import { QueryResponse } from './QueryResponse';

describe('QueryResponse', () => {
  it('should create NotFound instance', () => {
    const response: QueryResponse<string> = QueryResponse.NotFound.INSTANCE;
    expect(response.__type).toBe('NotFound');
  });

  it('should create InvalidState instance', () => {
    const response: QueryResponse<string> = QueryResponse.InvalidState.INSTANCE;
    expect(response.__type).toBe('InvalidState');
  });

  it('should create Found instance with value', () => {
    const value = 'example';
    const response: QueryResponse<string> = new QueryResponse.Found(value);
    expect(response.__type).toBe('Found');
    expect(response.__type === 'Found' && response.value).toBe(value);
  });

  it('should handle NotFound case', () => {
    const response: QueryResponse<string> = QueryResponse.NotFound.INSTANCE;
    let result = '';

    if (response.__type === 'NotFound') {
      result = 'NotFound';
    } else if (response.__type === 'InvalidState') {
      result = 'InvalidState';
    } else if (response.__type === 'Found') {
      result = response.value;
    } else {
      throw new Error(`Unhandled response: ${response}`);
    }

    expect(result).toBe('NotFound');
  });

  it('should handle InvalidState case', () => {
    const response: QueryResponse<string> = QueryResponse.InvalidState.INSTANCE;
    let result = '';

    if (response.__type === 'NotFound') {
      result = 'NotFound';
    } else if (response.__type === 'InvalidState') {
      result = 'InvalidState';
    } else if (response.__type === 'Found') {
      result = response.value;
    } else {
      throw new Error(`Unhandled response: ${response}`);
    }

    expect(result).toBe('InvalidState');
  });

  it('should handle Found case', () => {
    const value = 'example';
    const response: QueryResponse<string> = new QueryResponse.Found(value);
    let result = '';

    if (response.__type === 'NotFound') {
      result = 'NotFound';
    } else if (response.__type === 'InvalidState') {
      result = 'InvalidState';
    } else if (response.__type === 'Found') {
      result = response.value;
    } else {
      throw new Error(`Unhandled response: ${response}`);
    }

    expect(result).toBe(value);
  });
});
