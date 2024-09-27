import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { UrlBuilder, UrlBuilderJSON } from './UrlBuilder';
import { RequestId } from '.';

describe('UrlBuilder', () => {
  describe('WithRequestId', () => {
    it('should create an instance of WithRequestId', () => {
      const baseUrl = 'https://example.com/';
      const urlBuilder = new UrlBuilder.WithRequestId(baseUrl);

      expect(urlBuilder).toBeInstanceOf(UrlBuilder.WithRequestId);
      expect(urlBuilder.baseUrl).toBe(baseUrl);
      expect(urlBuilder.__type).toBe('WithRequestId');
    });

    it('should build the correct URL', () => {
      const baseUrl = 'https://example.com/';
      const requestId = new RequestId('123');
      const urlBuilder = new UrlBuilder.WithRequestId(baseUrl);

      const url = urlBuilder.buildUrl(requestId);

      expect(url).toBeInstanceOf(URL);
      expect(url.href).toBe('https://example.com/123');
    });

    it('should convert to JSON correctly', () => {
      const baseUrl = 'https://example.com/';
      const urlBuilder = new UrlBuilder.WithRequestId(baseUrl);

      const json = urlBuilder.toJSON();

      expect(json).toEqual({
        __type: 'WithRequestId',
        base_url: baseUrl,
      });
    });
  });

  describe('WithRequestIdTemplate', () => {
    it('should create an instance of WithRequestIdTemplate', () => {
      const template = 'https://example.com/:requestId';
      const urlBuilder = new UrlBuilder.WithRequestIdTemplate(template);

      expect(urlBuilder).toBeInstanceOf(UrlBuilder.WithRequestIdTemplate);
      expect(urlBuilder.template).toBe(template);
      expect(urlBuilder.__type).toBe('WithRequestIdTemplate');
    });

    it('should build the correct URL', () => {
      const template = 'https://example.com/:requestId';
      const requestId = new RequestId('123');
      const urlBuilder = new UrlBuilder.WithRequestIdTemplate(template);

      const url = urlBuilder.buildUrl(requestId);

      expect(url).toBeInstanceOf(URL);
      expect(url.href).toBe('https://example.com/123');
    });

    it('should convert to JSON correctly', () => {
      const template = 'https://example.com/:requestId';
      const urlBuilder = new UrlBuilder.WithRequestIdTemplate(template);

      const json = urlBuilder.toJSON();

      expect(json).toEqual({
        __type: 'WithRequestIdTemplate',
        template: template,
      });
    });
  });

  describe('Fix', () => {
    it('should create an instance of Fix', () => {
      const url = 'https://example.com/fixed';
      const urlBuilder = new UrlBuilder.Fix(url);

      expect(urlBuilder).toBeInstanceOf(UrlBuilder.Fix);
      expect(urlBuilder.url).toBe(url);
      expect(urlBuilder.__type).toBe('Fix');
    });

    it('should build the correct URL', () => {
      const url = 'https://example.com/fixed';
      const urlBuilder = new UrlBuilder.Fix(url);

      const builtUrl = urlBuilder.buildUrl(undefined as never);

      expect(builtUrl).toBeInstanceOf(URL);
      expect(builtUrl.href).toBe(url);
    });

    it('should convert to JSON correctly', () => {
      const url = 'https://example.com/fixed';
      const urlBuilder = new UrlBuilder.Fix(url);

      const json = urlBuilder.toJSON();

      expect(json).toEqual({
        __type: 'Fix',
        url,
      });
    });
  });

  describe('fromJSON', () => {
    it('should create a WithRequestId instance from JSON', () => {
      const json: UrlBuilderJSON = {
        __type: 'WithRequestId',
        base_url: 'https://example.com/',
      };

      const urlBuilder = UrlBuilder.fromJSON(json);

      expect(urlBuilder.__type).toBe('WithRequestId');

      if (urlBuilder.__type === 'WithRequestId') {
        expect(urlBuilder.baseUrl).toBe('https://example.com/');
      } else {
        expect.fail('Expected urlBuilder to be of type WithRequestId');
      }
    });

    it('should create a WithRequestIdTemplate instance from JSON', () => {
      const json: UrlBuilderJSON = {
        __type: 'WithRequestIdTemplate',
        template: 'https://example.com/:requestId',
      };

      const urlBuilder = UrlBuilder.fromJSON(json);

      expect(urlBuilder.__type).toBe('WithRequestIdTemplate');

      if (urlBuilder.__type === 'WithRequestIdTemplate') {
        expect(urlBuilder.template).toBe('https://example.com/:requestId');
      } else {
        expect.fail('Expected urlBuilder to be of type WithRequestIdTemplate');
      }
    });

    it('should create a Fix instance from JSON', () => {
      const json: UrlBuilderJSON = {
        __type: 'Fix',
        url: 'https://example.com/fixed',
      };

      const urlBuilder = UrlBuilder.fromJSON(json);

      expect(urlBuilder.__type).toBe('Fix');

      if (urlBuilder.__type === 'Fix') {
        expect(urlBuilder.url).toBe('https://example.com/fixed');
      } else {
        expect.fail('Expected urlBuilder to be of type Fix');
      }
    });
  });

  describe('buildUrlWithRequestId', () => {
    it('should build URL correctly with WithRequestId', () => {
      const baseUrl = 'https://example.com/';
      const requestId = new RequestId('123');
      const urlBuilder = new UrlBuilder.WithRequestId(baseUrl);

      const result = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId);

      expect(result).toBeInstanceOf(URL);
      expect(result.href).toBe('https://example.com/123');
    });

    it('should build URL correctly with WithRequestIdTemplate', () => {
      const template = 'https://example.com/:requestId';
      const requestId = new RequestId('123');
      const urlBuilder = new UrlBuilder.WithRequestIdTemplate(template);

      const result = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId);

      expect(result).toBeInstanceOf(URL);
      expect(result.href).toBe('https://example.com/123');
    });

    it('should build URL correctly with Fix', () => {
      const fixedUrl = 'https://example.com/fixed';
      const requestId = new RequestId('123'); // This will be ignored
      const urlBuilder = new UrlBuilder.Fix(fixedUrl);

      const result = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId);

      expect(result).toBeInstanceOf(URL);
      expect(result.href).toBe('https://example.com/fixed');
    });

    it('should handle different RequestId values for WithRequestIdTemplate', () => {
      const template = 'https://example.com/:requestId';
      const urlBuilder = new UrlBuilder.WithRequestIdTemplate(template);

      const requestId1 = new RequestId('abc');
      const result1 = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId1);
      expect(result1.href).toBe('https://example.com/abc');

      const requestId2 = new RequestId('xyz');
      const result2 = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId2);
      expect(result2.href).toBe('https://example.com/xyz');
    });

    it('should handle different RequestId values for WithRequestId', () => {
      const baseUrl = 'https://example.com/';
      const urlBuilder = new UrlBuilder.WithRequestId(baseUrl);

      const requestId1 = new RequestId('abc');
      const result1 = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId1);
      expect(result1.href).toBe('https://example.com/abc');

      const requestId2 = new RequestId('xyz');
      const result2 = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId2);
      expect(result2.href).toBe('https://example.com/xyz');
    });

    it('should always return the same URL for Fix regardless of RequestId', () => {
      const fixedUrl = 'https://example.com/fixed';
      const urlBuilder = new UrlBuilder.Fix(fixedUrl);

      const requestId1 = new RequestId('abc');
      const result1 = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId1);
      expect(result1.href).toBe('https://example.com/fixed');

      const requestId2 = new RequestId('xyz');
      const result2 = UrlBuilder.buildUrlWithRequestId(urlBuilder, requestId2);
      expect(result2.href).toBe('https://example.com/fixed');
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify WithRequestId', () => {
      const urlBuilder = new UrlBuilder.WithRequestId('https://example.com/');

      if (urlBuilder.__type === 'WithRequestId') {
        expect(urlBuilder.baseUrl).toBe('https://example.com/');
      } else {
        expect.fail('Expected urlBuilder to be of type WithRequestId');
      }

      switch (urlBuilder.__type) {
        case 'WithRequestId':
          expect(urlBuilder.baseUrl).toBe('https://example.com/');
          break;
        default:
          expect.fail('Expected urlBuilder to be of type WithRequestId');
      }
    });

    it('should correctly identify WithRequestIdTemplate', () => {
      const urlBuilder = new UrlBuilder.WithRequestIdTemplate(
        'https://example.com/:requestId'
      );

      if (urlBuilder.__type === 'WithRequestIdTemplate') {
        expect(urlBuilder.template).toBe('https://example.com/:requestId');
      } else {
        expect.fail('Expected urlBuilder to be of type WithRequestIdTemplate');
      }

      switch (urlBuilder.__type) {
        case 'WithRequestIdTemplate':
          expect(urlBuilder.template).toBe('https://example.com/:requestId');
          break;
        default:
          expect.fail(
            'Expected urlBuilder to be of type WithRequestIdTemplate'
          );
      }
    });

    it('should correctly identify Fix', () => {
      const urlBuilder = new UrlBuilder.Fix('https://example.com/fixed');

      if (urlBuilder.__type === 'Fix') {
        expect(urlBuilder.url).toBe('https://example.com/fixed');
      } else {
        expect.fail('Expected urlBuilder to be of type Fix');
      }

      switch (urlBuilder.__type) {
        case 'Fix':
          expect(urlBuilder.url).toBe('https://example.com/fixed');
          break;
        default:
          expect.fail('Expected urlBuilder to be of type Fix');
      }
    });
  });
});
