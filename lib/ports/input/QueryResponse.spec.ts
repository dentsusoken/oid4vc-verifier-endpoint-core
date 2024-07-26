import { describe, expect, it } from 'vitest';
import { QueryResponse } from './QueryResponse';

describe('QueryResponse', () => {
  it('should return a Found response', () => {
    const response = new QueryResponse.Found('test');
    expect(response).toBeInstanceOf(QueryResponse.Found);
    expect(response).not.toBe(QueryResponse.NotFound);
    expect(response).not.toBe(QueryResponse.InvalidState);
  });
  it('should return a NotFound response', () => {
    const response = QueryResponse.NotFound;
    expect(response).toBe(QueryResponse.NotFound);
    expect(response).not.toBe(QueryResponse.Found);
    expect(response).not.toBe(QueryResponse.InvalidState);
  });
  it('should return a InvalidState response', () => {
    const response = QueryResponse.InvalidState;
    expect(response).toBe(QueryResponse.InvalidState);
    expect(response).not.toBe(QueryResponse.Found);
    expect(response).not.toBe(QueryResponse.NotFound);
  });
});
