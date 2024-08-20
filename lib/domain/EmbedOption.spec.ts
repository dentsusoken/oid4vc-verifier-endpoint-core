import { describe, it, expect } from 'vitest';
import { UrlBuilder } from './UrlBuilder';
import { EmbedOption, EmbedOptionJSON } from './EmbedOption';

describe('EmbedOption', () => {
  describe('ByValue', () => {
    it('should create an instance of ByValue', () => {
      const embedOption = EmbedOption.ByValue.INSTANCE;

      expect(embedOption).toBeInstanceOf(EmbedOption.ByValue);
      expect(embedOption.toJSON()).toEqual({
        __type: 'ByValue',
      });
    });
  });

  describe('ByReference', () => {
    it('should create an instance of ByReference', () => {
      const urlBuilder = new UrlBuilder.WithRequestId('https://example.com/');
      const embedOption = new EmbedOption.ByReference(urlBuilder);

      expect(embedOption).toBeInstanceOf(EmbedOption.ByReference);
      expect(embedOption.urlBuilder).toBe(urlBuilder);
      expect(embedOption.toJSON()).toEqual({
        __type: 'ByReference',
        url_builder: {
          __type: 'WithRequestId',
          base_url: 'https://example.com/',
        },
      });
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of ByValue from JSON', () => {
      const json: EmbedOptionJSON = {
        __type: 'ByValue',
      };
      const embedOption = EmbedOption.fromJSON(json);

      expect(embedOption).toBeInstanceOf(EmbedOption.ByValue);
    });

    it('should create an instance of ByReference from JSON', () => {
      const json: EmbedOptionJSON = {
        __type: 'ByReference',
        url_builder: {
          __type: 'WithRequestId',
          base_url: 'https://example.com/',
        },
      };
      const embedOption = EmbedOption.fromJSON(json);

      expect(embedOption).toBeInstanceOf(EmbedOption.ByReference);
      expect(
        embedOption.__type === 'ByReference' && embedOption.urlBuilder
      ).toBeInstanceOf(UrlBuilder.WithRequestId);
      expect(
        embedOption.__type === 'ByReference' &&
          embedOption.urlBuilder.__type === 'WithRequestId' &&
          embedOption.urlBuilder.baseUrl
      ).toBe('https://example.com/');
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify ByValue', () => {
      const embedOption = EmbedOption.ByValue.INSTANCE;

      if (embedOption.__type === 'ByValue') {
        expect(embedOption).toBeInstanceOf(EmbedOption.ByValue);
      } else {
        expect.fail('Expected embedOption to be of type ByValue');
      }

      switch (embedOption.__type) {
        case 'ByValue':
          expect(embedOption).toBeInstanceOf(EmbedOption.ByValue);
          break;
        default:
          expect.fail('Expected embedOption to be of type ByValue');
      }
    });

    it('should correctly identify ByReference', () => {
      const urlBuilder: UrlBuilder = new UrlBuilder.WithRequestId(
        'https://example.com/'
      );
      const embedOption = new EmbedOption.ByReference(urlBuilder);

      if (embedOption.__type === 'ByReference') {
        expect(embedOption).toBeInstanceOf(EmbedOption.ByReference);
        expect(embedOption.urlBuilder).toBe(urlBuilder);
      } else {
        expect.fail('Expected embedOption to be of type ByReference');
      }

      switch (embedOption.__type) {
        case 'ByReference':
          expect(embedOption).toBeInstanceOf(EmbedOption.ByReference);
          expect(embedOption.urlBuilder).toBe(urlBuilder);
          break;
        default:
          expect.fail('Expected embedOption to be of type ByReference');
      }
    });
  });
});
