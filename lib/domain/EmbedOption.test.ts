import { describe, it, expect } from 'vitest';
import { BuildUrl } from './BuildUrl';
import { EmbedOption } from './EmbedOption';

describe('EmbedOption', () => {
  describe('ByValue', () => {
    it('should create a ByValue instance using the static INSTANCE', () => {
      const byValue = EmbedOption.ByValue.INSTANCE;

      expect(byValue).toBeInstanceOf(EmbedOption.ByValue);
      expect(byValue.__type).toBe('ByValue');
    });
  });

  describe('ByReference', () => {
    it('should create a ByReference instance', () => {
      const buildUrl = {} as BuildUrl<string>;
      const byReference = new EmbedOption.ByReference(buildUrl);

      expect(byReference).toBeInstanceOf(EmbedOption.ByReference);
      expect(byReference.__type).toBe('ByReference');
      expect(byReference.buildUrl).toBe(buildUrl);
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify ByValue type', () => {
      const option: EmbedOption = EmbedOption.ByValue.INSTANCE;

      if (option.__type === 'ByValue') {
        expect(option).toBeInstanceOf(EmbedOption.ByValue);
      } else {
        // This branch should not be reached in this test
        expect(true).toBe(false);
      }
    });

    it('should correctly identify ByReference type', () => {
      const buildUrl = {} as BuildUrl<string>;
      const option: EmbedOption = new EmbedOption.ByReference(buildUrl);

      if (option.__type === 'ByReference') {
        expect(option).toBeInstanceOf(EmbedOption.ByReference);
        expect(option.buildUrl).toBe(buildUrl);
      } else {
        // This branch should not be reached in this test
        expect(true).toBe(false);
      }
    });
  });
});
