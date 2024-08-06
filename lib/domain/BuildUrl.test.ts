import { describe, it, expect } from 'vitest';
import { BuildUrl } from './BuildUrl';

describe('BuildUrl', () => {
  it('should build URL with string ID', () => {
    const buildUrl: BuildUrl<string> = (id: string) =>
      new URL(`https://example.com/items/${id}`);
    const id = 'abc123';
    const expectedUrl = `https://example.com/items/${id}`;
    expect(buildUrl(id).toString()).toBe(expectedUrl);
  });

  it('should build URL with number ID', () => {
    const buildUrl: BuildUrl<number> = (id: number) =>
      new URL(`https://example.com/items/${id}`);
    const id = 123;
    const expectedUrl = `https://example.com/items/${id}`;
    expect(buildUrl(id).toString()).toBe(expectedUrl);
  });

  it('should build URL with custom object ID', () => {
    interface CustomId {
      category: string;
      itemId: number;
    }

    const buildUrl: BuildUrl<CustomId> = (id: CustomId) =>
      new URL(`https://example.com/${id.category}/${id.itemId}`);

    const id: CustomId = {
      category: 'electronics',
      itemId: 456,
    };
    const expectedUrl = `https://example.com/${id.category}/${id.itemId}`;
    expect(buildUrl(id).toString()).toBe(expectedUrl);
  });

  it('should throw error when building URL with invalid ID', () => {
    const buildUrl: BuildUrl<string> = (id: string) => new URL(`invalid/${id}`);
    const invalidId = 'aaa';
    expect(() => buildUrl(invalidId)).toThrowError('Invalid URL');
  });
});
