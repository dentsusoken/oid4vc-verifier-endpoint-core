import { describe, it, expect } from 'vitest';
import { QueryResponse } from './QueryResponse';

describe('QueryResponse', () => {
  describe('NotFound', () => {
    it('should create a NotFound instance using the static INSTANCE', () => {
      const notFound = QueryResponse.NotFound.INSTANCE;

      expect(notFound).toBeInstanceOf(QueryResponse.NotFound);
      expect(notFound.__type).toBe('NotFound');
    });
  });

  describe('InvalidState', () => {
    it('should create an InvalidState instance using the static INSTANCE', () => {
      const invalidState = QueryResponse.InvalidState.INSTANCE;

      expect(invalidState).toBeInstanceOf(QueryResponse.InvalidState);
      expect(invalidState.__type).toBe('InvalidState');
    });
  });

  describe('Found', () => {
    it('should create a Found instance with the provided value', () => {
      const value = 'example value';
      const found = new QueryResponse.Found(value);

      expect(found).toBeInstanceOf(QueryResponse.Found);
      expect(found.__type).toBe('Found');
      expect(found.value).toBe(value);
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify Found type', () => {
      const value = 'example value';
      const response: QueryResponse<string> = new QueryResponse.Found(value);

      if (response.__type === 'Found') {
        expect(response).toBeInstanceOf(QueryResponse.Found);
        expect(response.value).toBe(value);
      } else {
        // This branch should not be reached in this test
        expect(true).toBe(false);
      }
    });
  });
});
