import { describe, it, expect } from 'vitest';
import { GetWalletResponseMethod } from './GetWalletResponseMethod';
import { ZodError } from 'zod';

describe('GetWalletResponseMethod', () => {
  describe('Poll', () => {
    describe('fromJSON', () => {
      it('should return the Poll instance for a valid JSON object', () => {
        const json = { __type: 'Poll' };
        const result = GetWalletResponseMethod.Poll.fromJSON(json);
        expect(result).toBe(GetWalletResponseMethod.Poll.INSTANCE);
      });

      it('should throw a ZodError for an invalid JSON object', () => {
        const json = { __type: 'InvalidType' };

        try {
          GetWalletResponseMethod.Poll.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_literal',
              expected: 'Poll',
              path: ['__type'],
              message: `Invalid literal value, expected "Poll"`,
              received: 'InvalidType',
            },
          ]);
        }
      });
    });

    describe('toJSON', () => {
      it('should return the correct JSON representation', () => {
        const poll = GetWalletResponseMethod.Poll.INSTANCE;
        expect(poll.toJSON()).toEqual({ __type: 'Poll' });
      });
    });
  });

  describe('Redirect', () => {
    describe('fromJSON', () => {
      it('should create a Redirect instance for a valid JSON object', () => {
        const json = {
          __type: 'Redirect',
          redirect_uri_template: 'https://example.com/redirect',
        };
        const result = GetWalletResponseMethod.Redirect.fromJSON(json);
        expect(result).toBeInstanceOf(GetWalletResponseMethod.Redirect);
        expect(result.redirectUriTemplate).toBe('https://example.com/redirect');
      });

      it('should throw a ZodError for an invalid JSON object with missing redirect_uri_template', () => {
        const json = { __type: 'Redirect' };

        try {
          GetWalletResponseMethod.Redirect.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['redirect_uri_template'],
              message: 'Required',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with empty redirect_uri_template', () => {
        const json = { __type: 'Redirect', redirect_uri_template: '' };

        try {
          GetWalletResponseMethod.Redirect.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'too_small',
              minimum: 1,
              exact: false,
              type: 'string',
              inclusive: true,
              path: ['redirect_uri_template'],
              message: 'String must contain at least 1 character(s)',
            },
          ]);
        }
      });
    });

    describe('toJSON', () => {
      it('should return the correct JSON representation', () => {
        const redirect = new GetWalletResponseMethod.Redirect(
          'https://example.com/redirect'
        );
        expect(redirect.toJSON()).toEqual({
          __type: 'Redirect',
          redirect_uri_template: 'https://example.com/redirect',
        });
      });
    });
  });
});
