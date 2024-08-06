import { describe, it, expect } from 'vitest';
import { BuildUrl } from './BuildUrl';
import { EmbedOptionNS } from './EmbedOption';

describe('EmbedOption', () => {
  describe('ByValue', () => {
    it('should create an instance of ByValue', () => {
      const embedOption = new EmbedOptionNS.ByValue();
      expect(embedOption).toBeInstanceOf(EmbedOptionNS.ByValue);
    });

    it('should be identified as ByValue by isByValue function', () => {
      const embedOption = new EmbedOptionNS.ByValue();
      expect(EmbedOptionNS.isByValue(embedOption)).toBe(true);
    });

    it('should not be identified as ByReference by isByReference function', () => {
      const embedOption = new EmbedOptionNS.ByValue();
      expect(EmbedOptionNS.isByReference(embedOption)).toBe(false);
    });
  });

  describe('ByReference', () => {
    it('should create an instance of ByReference with a BuildUrl function', () => {
      const buildUrl: BuildUrl<string> = (id: string) =>
        new URL(`https://example.com/items/${id}`);
      const embedOption = new EmbedOptionNS.ByReference(buildUrl);
      expect(embedOption).toBeInstanceOf(EmbedOptionNS.ByReference);
      expect(embedOption.buildUrl).toBe(buildUrl);
    });

    it('should build URL using the provided BuildUrl function', () => {
      const buildUrl: BuildUrl<number> = (id: number) =>
        new URL(`https://example.com/items/${id}`);
      const embedOption = new EmbedOptionNS.ByReference(buildUrl);
      const id = 123;
      const expectedUrl = `https://example.com/items/${id}`;
      expect(embedOption.buildUrl(id).toString()).toBe(expectedUrl);
    });

    it('should not be identified as ByValue by isByValue function', () => {
      const buildUrl: BuildUrl<string> = (id: string) =>
        new URL(`https://example.com/items/${id}`);
      const embedOption = new EmbedOptionNS.ByReference(buildUrl);
      expect(EmbedOptionNS.isByValue(embedOption)).toBe(false);
    });

    it('should be identified as ByReference by isByReference function', () => {
      const buildUrl: BuildUrl<string> = (id: string) =>
        new URL(`https://example.com/items/${id}`);
      const embedOption = new EmbedOptionNS.ByReference(buildUrl);
      expect(EmbedOptionNS.isByReference(embedOption)).toBe(true);
    });
  });
});
