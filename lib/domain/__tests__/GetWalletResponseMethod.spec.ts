import { describe, it, expect } from 'vitest';
import {
  GetWalletResponseMethod,
  getWalletResponseMethodSchema,
  GetWalletResponseMethodJSON,
} from '../GetWalletResponseMethod';
import { ZodError } from 'zod';

describe('GetWalletResponseMethod', () => {
  describe('Poll', () => {
    it('should have a singleton instance', () => {
      expect(GetWalletResponseMethod.Poll.INSTANCE).toBeDefined();
      expect(GetWalletResponseMethod.Poll.INSTANCE).toBe(
        GetWalletResponseMethod.Poll.INSTANCE
      );
    });

    it('should have the correct __type', () => {
      expect(GetWalletResponseMethod.Poll.INSTANCE.__type).toBe('Poll');
    });

    it('should serialize to JSON correctly', () => {
      expect(GetWalletResponseMethod.Poll.INSTANCE.toJSON()).toEqual({
        __type: 'Poll',
      });
    });
  });

  describe('Redirect', () => {
    const redirectUri = 'https://example.com/redirect';

    it('should create an instance with the correct properties', () => {
      const redirect = new GetWalletResponseMethod.Redirect(redirectUri);
      expect(redirect.__type).toBe('Redirect');
      expect(redirect.redirectUriTemplate).toBe(redirectUri);
    });

    it('should serialize to JSON correctly', () => {
      const redirect = new GetWalletResponseMethod.Redirect(redirectUri);
      expect(redirect.toJSON()).toEqual({
        __type: 'Redirect',
        redirect_uri_template: redirectUri,
      });
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of Poll from JSON', () => {
      const json: GetWalletResponseMethodJSON = {
        __type: 'Poll',
      };
      const getWalletResponseMethod = GetWalletResponseMethod.fromJSON(json);

      expect(getWalletResponseMethod).toBeInstanceOf(
        GetWalletResponseMethod.Poll
      );
    });

    it('should create an instance of Redirect from JSON', () => {
      const json: GetWalletResponseMethodJSON = {
        __type: 'Redirect',
        redirect_uri_template: 'https://example.com/redirect',
      };
      const getWalletResponseMethod = GetWalletResponseMethod.fromJSON(json);

      expect(getWalletResponseMethod).toBeInstanceOf(
        GetWalletResponseMethod.Redirect
      );
      expect(
        getWalletResponseMethod.__type === 'Redirect' &&
          getWalletResponseMethod.redirectUriTemplate
      ).toBe(json.redirect_uri_template);
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify Poll', () => {
      const poll = GetWalletResponseMethod.Poll.INSTANCE;

      if (poll.__type === 'Poll') {
        expect(poll).toBeInstanceOf(GetWalletResponseMethod.Poll);
      } else {
        expect.fail('Expected poll to be of type Poll');
      }

      switch (poll.__type) {
        case 'Poll':
          expect(poll).toBeInstanceOf(GetWalletResponseMethod.Poll);
          break;
        default:
          expect.fail('Expected poll to be of type Poll');
      }
    });

    it('should correctly identify Redirect', () => {
      const redirect = new GetWalletResponseMethod.Redirect(
        'https://example.com/redirect'
      );

      if (redirect.__type === 'Redirect') {
        expect(redirect).toBeInstanceOf(GetWalletResponseMethod.Redirect);
        expect(redirect.redirectUriTemplate).toBe(
          'https://example.com/redirect'
        );
      } else {
        expect.fail('Expected redirect to be of type Redirect');
      }

      switch (redirect.__type) {
        case 'Redirect':
          expect(redirect).toBeInstanceOf(GetWalletResponseMethod.Redirect);
          expect(redirect.redirectUriTemplate).toBe(
            'https://example.com/redirect'
          );
          break;
        default:
          expect.fail('Expected redirect to be of type Redirect');
      }
    });
  });
});

describe('getWalletResponseMethodSchema', () => {
  it('should validate Poll correctly', () => {
    const pollData = { __type: 'Poll' };
    expect(getWalletResponseMethodSchema.parse(pollData)).toEqual(pollData);
  });

  it('should validate Redirect correctly', () => {
    const redirectData = {
      __type: 'Redirect',
      redirect_uri_template: 'https://example.com/redirect',
    };
    expect(getWalletResponseMethodSchema.parse(redirectData)).toEqual(
      redirectData
    );
  });

  it('should reject invalid __type', () => {
    const invalidData = { __type: 'Invalid' };
    expect(() => getWalletResponseMethodSchema.parse(invalidData)).toThrow(
      ZodError
    );
  });

  it('should reject Redirect without redirect_uri_template', () => {
    const invalidData = { __type: 'Redirect' };
    expect(() => getWalletResponseMethodSchema.parse(invalidData)).toThrow(
      ZodError
    );
  });

  it('should reject Redirect with invalid redirect_uri_template', () => {
    const invalidData = {
      __type: 'Redirect',
      redirect_uri_template: 'invalid',
    };
    expect(() => getWalletResponseMethodSchema.parse(invalidData)).toThrow(
      ZodError
    );
  });
});

describe('GetWalletResponseMethodJSON type', () => {
  it('should be assignable to Poll JSON', () => {
    const pollJson: GetWalletResponseMethodJSON = { __type: 'Poll' };
    expect(pollJson.__type).toBe('Poll');
  });

  it('should be assignable to Redirect JSON', () => {
    const redirectJson: GetWalletResponseMethodJSON = {
      __type: 'Redirect',
      redirect_uri_template: 'https://example.com/redirect',
    };
    expect(redirectJson.__type).toBe('Redirect');
    expect(redirectJson.redirect_uri_template).toBe(
      'https://example.com/redirect'
    );
  });

  // it('should not be assignable to invalid types', () => {
  //   const invalidJson: GetWalletResponseMethodJSON = { __type: 'Invalid' };

  //   // This test will always pass at runtime, but it checks for TypeScript compilation errors
  //   expect(true).toBe(true);
  // });
});
